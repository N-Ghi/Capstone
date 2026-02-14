from Location.models import GeoLocation
from Location.serializers import GeoLocationSerializer
from .models import Experience
from rest_framework import serializers


class ExperienceSerializer(serializers.ModelSerializer):
    location = GeoLocationSerializer(required=False)

    class Meta:
        model = Experience
        fields = '__all__'
        read_only_fields = ['id', 'guide']

    def create(self, validated_data):
        expertise = validated_data.pop('expertise', [])
        languages = validated_data.pop('languages', [])
        payment_methods = validated_data.pop('payment_methods', [])

        location_data = validated_data.pop('location', None)

        experience = Experience.objects.create(**validated_data)

        if location_data:
            location = GeoLocation.objects.create(**location_data)
            experience.location = location
            experience.save()

        experience.expertise.set(expertise)
        experience.languages.set(languages)
        experience.payment_methods.set(payment_methods)

        return experience

    def update(self, instance, validated_data):
        expertise = validated_data.pop('expertise', None)
        languages = validated_data.pop('languages', None)
        payment_methods = validated_data.pop('payment_methods', None)
        location_data = validated_data.pop('location', None)

        if location_data:
            if instance.location:
                for attr, value in location_data.items():
                    setattr(instance.location, attr, value)
                instance.location.save()
            else:
                instance.location = GeoLocation.objects.create(**location_data)

        instance = super().update(instance, validated_data)

        if expertise is not None:
            instance.expertise.set(expertise)

        if languages is not None:
            instance.languages.set(languages)

        if payment_methods is not None:
            instance.payment_methods.set(payment_methods)

        return instance
