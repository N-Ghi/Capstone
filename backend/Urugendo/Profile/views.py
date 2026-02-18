from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import action
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from Urugendo.permissions import IsAdmin
from .serializers import GuideSerializer, TouristSerializer

User = get_user_model()


class ProfileViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def _get_serializer(self, user, *args, **kwargs):
        """Return the appropriate serializer based on the user's role."""
        if user.role == 'Tourist':
            return TouristSerializer(*args, **kwargs)
        elif user.role == 'Guide':
            return GuideSerializer(*args, **kwargs)
        return None

    def _get_profile(self, user):
        """Return the profile instance for the given user, or None."""
        if user.role == 'Tourist' and hasattr(user, 'tourist_profile'):
            return user.tourist_profile
        elif user.role == 'Guide' and hasattr(user, 'guide_profile'):
            return user.guide_profile
        return None

    def _is_owner_or_admin(self, request, user):
        """Check if the requester is the profile owner or an Admin."""
        return request.user == user or request.user.role == 'Admin'

    # POST /profiles/create/
    def create(self, request):
        """Create a profile for the authenticated user."""
        user = request.user

        if self._get_profile(user):
            return Response(
                {"error": "This user already has a profile."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = self._get_serializer(user, data=request.data)
        if serializer is None:
            return Response(
                {"error": "Admins do not have profiles."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if serializer.is_valid():
            serializer.save(user_id=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # GET /profiles/
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated, IsAdmin])
    def get_profiles(self, request):
        """List all tourist and guide profiles (Admin/SuperAdmin only)."""
        tourists = TouristSerializer(
            User.objects.filter(role='Tourist', tourist_profile__isnull=False),
            many=True
        )
        guides = GuideSerializer(
            User.objects.filter(role='Guide', guide_profile__isnull=False),
            many=True
        )
        return Response({"tourists": tourists.data, "guides": guides.data})

    # GET /profiles/<user_id>/
    def retrieve(self, request, pk=None):
        """Retrieve a single user's profile."""
        user = get_object_or_404(User, id=pk)

        if not self._is_owner_or_admin(request, user):
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )

        profile = self._get_profile(user)
        if profile is None:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self._get_serializer(user, profile)
        return Response(serializer.data)

    # PUT/PATCH /profiles/<user_id>/
    def update(self, request, pk=None):
        """Full update of a user's profile."""
        return self._update(request, pk, partial=False)

    def partial_update(self, request, pk=None):
        """Partial update of a user's profile."""
        return self._update(request, pk, partial=True)

    def _update(self, request, pk, partial):
        user = get_object_or_404(User, id=pk)

        if not self._is_owner_or_admin(request, user):
            return Response(
                {"error": "You do not have permission to update this profile."},
                status=status.HTTP_403_FORBIDDEN
            )

        profile = self._get_profile(user)
        if profile is None:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        serializer = self._get_serializer(user, profile, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save(user_id=user)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE /profiles/<user_id>/
    def destroy(self, request, pk=None):
        """Delete a user's profile."""
        user = get_object_or_404(User, id=pk)

        if not self._is_owner_or_admin(request, user):
            return Response(
                {"error": "You do not have permission to delete this profile."},
                status=status.HTTP_403_FORBIDDEN
            )

        profile = self._get_profile(user)
        if profile is None:
            return Response({"error": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        profile.delete()
        return Response({"detail": "Profile deleted."}, status=status.HTTP_204_NO_CONTENT)
