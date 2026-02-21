import django_filters
from .models import Experience

class ExperienceFilter(django_filters.FilterSet):
    # Filter by TravelPreference UUID
    expertise = django_filters.UUIDFilter(
        field_name='expertise__id'
    )

    # Optional: filter by name (more user-friendly)
    expertise_name = django_filters.CharFilter(
        field_name='expertise__name',
        lookup_expr='iexact'
    )

    class Meta:
        model = Experience
        fields = ['expertise', 'expertise_name']