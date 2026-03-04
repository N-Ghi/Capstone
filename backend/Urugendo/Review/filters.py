import django_filters
from .models import Review

class ReviewFilter(django_filters.FilterSet):
    # Filter by Experience UUID
    experience = django_filters.UUIDFilter(
        field_name='experience'
    )

    # Filter by rating
    rating = django_filters.CharFilter(
        field_name='rating',
    )

    # Filter by traveler (user) UUID
    traveler = django_filters.UUIDFilter(
        field_name='traveler'
    )


    class Meta:
        model = Review
        fields = ['experience', 'rating', 'traveler']