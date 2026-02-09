from rest_framework import serializers

class ProfileImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()


class ExperienceImageUploadSerializer(serializers.Serializer):
    image = serializers.ImageField()