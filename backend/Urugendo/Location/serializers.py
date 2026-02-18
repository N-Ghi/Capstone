from rest_framework import serializers
from .models import Location


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = ["id", "place_name", "latitude", "longitude", "place_id"]
        read_only_fields = ["id"]

class GeocodeRequestSerializer(serializers.Serializer):
    """Validates the incoming geocode request from the frontend."""
    place_name = serializers.CharField(max_length=255)

class LocationSaveSerializer(serializers.Serializer):
    """Validates the save-to-DB request (frontend sends back confirmed coordinates)."""
    place_name = serializers.CharField(max_length=255)
    latitude = serializers.DecimalField(max_digits=15, decimal_places=10)
    longitude = serializers.DecimalField(max_digits=15, decimal_places=10)
    place_id = serializers.CharField(max_length=255, required=False, allow_blank=True)