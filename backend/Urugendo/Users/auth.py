from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from Utils.jwt import get_tokens_for_user
from .serializers import UserSerializer

from django.urls import reverse
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from Utils.email import send_verification_email

User = get_user_model()


# Tourist registration endpoint
@api_view(['POST'])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Generate verification token
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        verification_path = reverse('verify-email', kwargs={'uidb64': uid, 'token': token})
        verification_link = request.build_absolute_uri(verification_path)

        # Mock email send
        send_verification_email(user.email, verification_link)

        return Response({
            "message": "Registration successful. Please verify your email to activate your account."
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Email verification endpoint
@api_view(['GET'])
def verify_email(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({"error": "Invalid verification link."}, status=status.HTTP_400_BAD_REQUEST)

    if default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({"message": "Email verified successfully. You can now log in."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Verification link is invalid or expired."}, status=status.HTTP_400_BAD_REQUEST)



# Login endpoint
@api_view(['POST'])
def login(request):
    identifier = request.data.get('identifier')  # username or email
    password = request.data.get('password')

    if not identifier or not password:
        return Response(
            {"error": "Username/email and password are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Try email, then username
        user = User.objects.filter(email=identifier).first() or \
               User.objects.filter(username=identifier).first()

        if not user:
            raise User.DoesNotExist

    except User.DoesNotExist:
        return Response(
            {"error": "Invalid credentials."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.check_password(password):
        return Response(
            {"error": "Invalid credentials."},
            status=status.HTTP_401_UNAUTHORIZED
        )

    if not user.is_active:
        return Response(
            {"error": "Account is not verified."},
            status=status.HTTP_403_FORBIDDEN
        )

    tokens = get_tokens_for_user(user)

    return Response({
        "tokens": tokens,
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "role": user.role,
            "profile_picture": user.profile_picture,
        }
    }, status=status.HTTP_200_OK)
