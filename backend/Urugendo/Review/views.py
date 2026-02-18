from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from Urugendo.permissions import IsTourist, IsAdmin
from .serializers import ReviewSerializer
from .models import Review


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticated(), IsTourist()]
        if self.action in ['update', 'partial_update']:
            return [IsAuthenticated(), IsTourist()]
        if self.action == 'destroy':
            return [IsAuthenticated(), (IsTourist | IsAdmin)()]
        # list, retrieve
        return [IsAuthenticated()]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['traveler'] = self.request.user
        return context

    # POST /reviews/
    def create(self, request, *args, **kwargs):
        """Create a review. Only tourists can create, and only once per experience."""
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        serializer.save(traveler=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # GET /reviews/
    def list(self, request, *args, **kwargs):
        """List all reviews."""
        return super().list(request, *args, **kwargs)

    # PUT/PATCH /reviews/<id>/
    def update(self, request, *args, **kwargs):
        """Update a review. Only the traveler who created it can update it."""
        review = self.get_object()
        if review.traveler != request.user:
            return Response(
                {"detail": "You do not have permission to update this review."},
                status=status.HTTP_403_FORBIDDEN
            )
        partial = kwargs.pop('partial', False)
        serializer = self.get_serializer(review, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def partial_update(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    # DELETE /reviews/<id>/
    def destroy(self, request, *args, **kwargs):
        """Delete a review. Only the owner or an Admin can delete."""
        review = self.get_object()
        if review.traveler != request.user and not request.user.is_staff:
            return Response(
                {"detail": "You do not have permission to delete this review."},
                status=status.HTTP_403_FORBIDDEN
            )
        review.delete()
        return Response({"detail": "Review deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
