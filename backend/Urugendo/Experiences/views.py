from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from Urugendo.permissions import IsAdmin, IsSuperAdmin, IsGuide
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Experience
from .serializers import ExperienceSerializer

User = get_user_model()


# Create a new experience. Only guides and admins can create experiences. Admins can specify the guide for the experience, while guides can only create experiences for themselves.
@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdmin | IsSuperAdmin | IsGuide])
def create_experience(request):

    user = request.user
    data = request.data.copy()
    serializer = ExperienceSerializer(data=data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Determine guide
    if user.role == 'Admin':
        guide_id = data.get('guide_id')
        if not guide_id:
            return Response(
                {"error": "guide_id is required for admin."},
                status=status.HTTP_400_BAD_REQUEST
            )
        try:
            guide = User.objects.get(id=guide_id, role='Guide')
        except User.DoesNotExist:
            return Response(
                {"error": "Guide with the specified ID does not exist."},
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        guide = user

    serializer.save(guide=guide)

    return Response(serializer.data, status=status.HTTP_201_CREATED)

# Retrieve all experiences. Open to everyone
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_experiences(request):
    experiences = Experience.objects.all()
    serializer = ExperienceSerializer(experiences, many=True)
    return Response(serializer.data)

# Retrieve a single experience by ID. Open to every one
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_experience(request, experience_id):
    experience = get_object_or_404(Experience, id=experience_id)
    serializer = ExperienceSerializer(experience)
    return Response(serializer.data)

# Update an experience. Only the guide who created the experience or admins can update it.
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated, IsAdmin | IsSuperAdmin | IsGuide])
def update_experience(request, experience_id):

    experience = get_object_or_404(Experience, id=experience_id)
    user = request.user

    if user.role == 'Guide' and experience.guide != user:
        return Response({"error": "You do not have permission to update this experience."}, status=status.HTTP_403_FORBIDDEN)

    data = request.data.copy()
    partial = request.method == 'PATCH'
    serializer = ExperienceSerializer(experience, data=data, partial=partial)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Delete an experience. Only the guide who created the experience or admins can delete it.
@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdmin | IsSuperAdmin | IsGuide])
def delete_experience(request, experience_id):

    experience = get_object_or_404(Experience, id=experience_id)
    user = request.user

    if user.role == 'Guide' and experience.guide != user:
        return Response({"error": "You do not have permission to delete this experience."}, status=status.HTTP_403_FORBIDDEN)
    
    experience.delete()
    return Response({"detail": "Experience deleted."}, status=status.HTTP_204_NO_CONTENT)
