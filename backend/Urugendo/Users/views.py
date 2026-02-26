from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from Urugendo.permissions import IsAdmin
from .serializers import UserSerializer
from rest_framework.decorators import action

User = get_user_model()


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'pk'

    def get_permissions(self):
        if self.action == 'list':
            return [IsAdmin()]
        return [IsAuthenticated()]

    def _is_authorized(self, request, user_id):
        """Allow access only to admins or the user themselves."""
        return request.user.role == 'Admin' or str(request.user.id) == str(user_id)

    def list(self, request, *args, **kwargs):
        """GET /users/all/ — List all users (Admin/SuperAdmin only)."""
        return super().list(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        """GET /users/<id>/ — Retrieve a single user."""
        instance = self.get_object()
        if not self._is_authorized(request, instance.id):
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='me')
    def retrieve_me(self, request, *args, **kwargs):
        """GET /users/me/ — Retrieve the authenticated user's profile."""
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        """PUT/PATCH /users/<id>/ — Update a user."""
        instance = self.get_object()
        if not self._is_authorized(request, instance.id):
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        """DELETE /users/<id>/ — Delete a user."""
        instance = self.get_object()
        if not self._is_authorized(request, instance.id):
            return Response(
                {"detail": "You do not have permission to perform this action."},
                status=status.HTTP_403_FORBIDDEN
            )
        # TODO: Add redis jobs to delete user-related data if necessary
        instance.delete()
        return Response({"detail": "User deleted."}, status=status.HTTP_204_NO_CONTENT)

    # Disable create — registration is handled by auth/create/
    def create(self, request, *args, **kwargs):
        return Response(
            {"detail": "Use /users/auth/create/ to register."},
            status=status.HTTP_405_METHOD_NOT_ALLOWED
        )
