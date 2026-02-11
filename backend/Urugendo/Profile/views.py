from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from .serializers import GuideSerializer, TouristSerializer

User = get_user_model()


# Create a new profile
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_profile(request):
    user = request.user

    # Check if the user already has a profile
    if (user.role == 'Tourist' and hasattr(user, 'tourist_profile')) or (user.role == 'Guide' and hasattr(user, 'guide_profile')):
        return Response({"error": "This user already has a profile."}, status=status.HTTP_400_BAD_REQUEST)
    
    serializer = None
    if user.role == 'Tourist':
        serializer = TouristSerializer(data=request.data)
    elif user.role == 'Guide':
        serializer = GuideSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user_id=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Retrieve a profile
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)

    # Only admins and the user themselves can access this endpoint
    if not (request.user.role == 'admin' or request.user.id == user_id):
        return Response({"detail": "You do not have permission to perform this action."}, status=status.HTTP_403_FORBIDDEN)
    
    if user.role == 'Tourist' and hasattr(user, 'tourist_profile'):
        serializer = TouristSerializer(user.tourist_profile)
        return Response(serializer.data)
    elif user.role == 'Guide' and hasattr(user, 'guide_profile'):
        serializer = GuideSerializer(user.guide_profile)
        return Response(serializer.data)
    
    return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

# Update a profile
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile(request, user_id):

    user = get_object_or_404(User, id=user_id)

    # Check if the user is the owner of the profile or an admin
    if request.user != user and not (request.user.role == 'Admin'):
        return Response({"error": "You do not have permission to update this profile."}, status=status.HTTP_403_FORBIDDEN)

    
    partial = request.method == 'PATCH'

    if user.role == 'Tourist' and hasattr(user, 'tourist_profile'):
        serializer = TouristSerializer(user.tourist_profile, data=request.data, partial=partial)
    elif user.role == 'Guide' and hasattr(user, 'guide_profile'):
        serializer = GuideSerializer(user.guide_profile, data=request.data, partial=partial)
    else:
        return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

    if serializer.is_valid():
        serializer.save(user_id=user)
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete a profile
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile(request, user_id):
    user = get_object_or_404(User, id=user_id)

    # Check if the user is the owner of the profile or an admin
    if request.user != user and not (request.user.role == 'Admin'):
        return Response({"error": "You do not have permission to delete this profile."}, status=status.HTTP_403_FORBIDDEN)

    if user.role == 'Tourist' and hasattr(user, 'tourist_profile'):
        user.tourist_profile.delete()
        return Response({"detail": "Profile deleted."}, status=status.HTTP_204_NO_CONTENT)
    elif user.role == 'Guide' and hasattr(user, 'guide_profile'):
        user.guide_profile.delete()
        return Response({"detail": "Profile deleted."}, status=status.HTTP_204_NO_CONTENT)
    
    return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)
