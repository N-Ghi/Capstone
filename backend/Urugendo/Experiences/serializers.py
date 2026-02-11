from Location.models import GeoLocation
from Location.serializers import GeoLocationSerializer
from .models import Experience
from rest_framework import serializers


class ExperienceSerializer(serializers.ModelSerializer):
    location = GeoLocationSerializer(required=False)

    class Meta:
        model = Experience
        fields = '__all__'

    def create(self, validated_data):
        location_data = validated_data.pop('location', None)
        experience = Experience.objects.create(**validated_data)
        if location_data:
            location = GeoLocation.objects.create(**location_data)
            experience.location = location
            experience.save()
        return experience

    def update(self, instance, validated_data):
        location_data = validated_data.pop('location', None)
        if location_data:
            if instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                instance.location = GeoLocation.objects.create(**location_data)
        return super().update(instance, validated_data)
