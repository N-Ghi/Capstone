import django_filters
from .models import Experience

class ExperienceFilter(django_filters.FilterSet):

    # Filters for expertise
    expertise = django_filters.UUIDFilter(field_name='expertise__id')
    expertise_name = django_filters.CharFilter(
        field_name='expertise__name', lookup_expr='iexact'
    )

    # Filters for guide
    guide_id = django_filters.UUIDFilter(field_name='guide__id')
    guide_username = django_filters.CharFilter(
        field_name='guide__username', lookup_expr='iexact'
    )
    
    # Filters for title and description (partial match)
    title = django_filters.CharFilter(
        field_name='title', lookup_expr='icontains'
    )
    description = django_filters.CharFilter(
        field_name='description', lookup_expr='icontains'
    )

    class Meta:
        model = Experience
        fields = [
            'expertise', 'expertise_name', 'guide_id', 'guide_username', 'title', 'description',
        ]