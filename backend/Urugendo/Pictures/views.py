from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .utils import upload_image_to_supabase
from .serializers import ProfileImageUploadSerializer, ExperienceImageUploadSerializer
from .supabase_client import supabase
import uuid


# Profile Image Upload
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_profile_image(request):
    serializer = ProfileImageUploadSerializer(data=request.data)
    if serializer.is_valid():
        image_file = serializer.validated_data['image']
        user_id = str(request.user.id)

        try:
            public_url = upload_image_to_supabase( image_file=image_file,
                bucket_name='profile-images', user_id=user_id, delete_old=True
            )
            return Response({"url": public_url}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Experience Image Upload
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_experience_image(request):
    serializer = ExperienceImageUploadSerializer(data=request.data)
    if serializer.is_valid():
        image_file = serializer.validated_data['image']
        user_id = str(request.user.id)

        try:
            public_url = upload_image_to_supabase(
                image_file=image_file, bucket_name='experience-images',
                user_id=user_id, delete_old=False
            )
            return Response({"url": public_url}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
