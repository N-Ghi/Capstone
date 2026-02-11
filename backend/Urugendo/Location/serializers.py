from rest_framework import serializers

from .models import GeoLocation

class GeoLocationSerializer(serializers.ModelSerializer):
    google_maps_url = serializers.SerializerMethodField()

    class Meta:
        model = GeoLocation
        fields = ['latitude', 'longitude', 'address', 'google_maps_url']

    def get_google_maps_url(self, obj):
        return obj.google_maps_url()