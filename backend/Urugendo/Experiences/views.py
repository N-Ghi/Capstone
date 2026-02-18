from rest_framework import serializers, viewsets, status
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

from .models import Experience, ExperienceSlot
from .serializers import ExperienceSerializer, ExperienceListSerializer, ExperienceSlotSerializer
from Urugendo.permissions import IsGuideOwnerOrAdmin, IsAdmin, IsGuide

User = get_user_model()


class ExperienceViewSet(ModelViewSet):
    queryset = Experience.objects.select_related( "guide", "location"
    ).prefetch_related( "expertise", "languages", "payment_methods"
    ).filter(is_active=True)

    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'list':
            return ExperienceListSerializer
        return ExperienceSerializer

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), IsGuideOwnerOrAdmin()]
        if self.action == 'create':
            return [IsAuthenticated(), (IsAdmin | IsGuide)()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        user = self.request.user

        if user.role == 'Admin':
            guide_id = self.request.data.get("guide_id")
            if not guide_id:
                raise serializers.ValidationError(
                    {"guide_id": "Required for admin."}
                )
            guide = get_object_or_404(User, id=guide_id, role='Guide')
        else:
            guide = user

        serializer.save(guide=guide)

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()

class ExperienceSlotViewSet(ModelViewSet):
    """
    Nested ViewSet for managing slots under a specific experience.
    URL: /experiences/<exp_id>/slots/<pk>/
    """
    serializer_class = ExperienceSlotSerializer
    permission_classes = [IsAuthenticated]

    def _get_experience(self):
        if not hasattr(self, '_experience'):
            self._experience = get_object_or_404(
                Experience, pk=self.kwargs['exp_id']
            )
        return self._experience

    def get_queryset(self):
        return ExperienceSlot.objects.filter(
            experience=self._get_experience(),
            is_active=True
        ).order_by('date')

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAuthenticated(), (IsAdmin | IsGuide)()]
        return [IsAuthenticated()]

    def _is_authorized_for_experience(self, request, experience):
        """
        Guides can only manage slots for their own experiences.
        Admins can manage any experience's slots.
        """
        if request.user.role == 'Admin':
            return True
        if request.user.role == 'Guide' and experience.guide == request.user:
            return True
        return False

    def create(self, request, *args, **kwargs):
        experience = self._get_experience()

        if not self._is_authorized_for_experience(request, experience):
            return Response(
                {"detail": "You can only create slots for your own experiences."},
                status=status.HTTP_403_FORBIDDEN
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(experience=experience)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        experience = self._get_experience()

        if not self._is_authorized_for_experience(request, experience):
            return Response(
                {"detail": "You can only update slots for your own experiences."},
                status=status.HTTP_403_FORBIDDEN
            )

        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        experience = self._get_experience()

        if not self._is_authorized_for_experience(request, experience):
            return Response(
                {"detail": "You can only delete slots for your own experiences."},
                status=status.HTTP_403_FORBIDDEN
            )

        instance = self.get_object()
        instance.is_active = False
        instance.save()
        return Response(
            {"detail": "Slot deleted successfully."},
            status=status.HTTP_204_NO_CONTENT
        )
