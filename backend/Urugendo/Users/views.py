from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from Urugendo.permissions import IsAdmin, IsSuperAdmin
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .serializers import UserSerializer

User = get_user_model()


# List all users
@api_view(['GET'])
@permission_classes([IsAdmin | IsSuperAdmin])
def user_list(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Retrieve single user
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_detail(request, user_id):
    # Only admins and the user themselves can access this endpoint
    if not (request.user.role == 'admin' or request.user.id == user_id):
        return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
    user = get_object_or_404(User, pk=user_id)
    serializer = UserSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)

# Update a user
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def user_update(request, user_id):

    # Only admins and the user themselves can access this endpoint
    if not (request.user.role == 'admin' or request.user.id == user_id):
        return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
    
    user = get_object_or_404(User, pk=user_id)
    partial = request.method == 'PATCH'
    serializer = UserSerializer(user, data=request.data, partial=partial)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete a user
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def user_delete(request, user_id):

    # Only admins and the user themselves can access this endpoint
    if not (request.user.role == 'admin' or request.user.id == user_id):
        return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
    
    # Add redis jobs to delete user-related data if necessary

    user = get_object_or_404(User, pk=user_id)
    user.delete()
    return Response({"detail": "User deleted."}, status=status.HTTP_204_NO_CONTENT)
