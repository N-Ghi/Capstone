from rest_framework import serializers
from Location.models import Location
from Location.serializers import LocationSerializer
from Choices.serializers import LanguageSerializer
from Choices.models import Language
from .models import Experience, ExperienceSlot
from django.db.models import Avg, Count


class ExperienceSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    location_id = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(),
        write_only=True, required=False, allow_null=True, source='location'
    )
    origin_lang = LanguageSerializer(read_only=True)
    origin_lang_id = serializers.PrimaryKeyRelatedField(
        queryset=Language.objects.all(),
        write_only=True, required=False, allow_null=True, source='origin_lang'
    )

    class Meta:
        model = Experience
        fields = [
            'id', 'guide', 'title', 'description', 'expertise',
            'location', 'location_id', 'photos', 'languages',
            'payment_methods', 'is_active', 'created_at', 'updated_at',
            'origin_lang', 'origin_lang_id',
        ]
        read_only_fields = ['id', 'guide', 'created_at', 'updated_at']

    def create(self, validated_data):
        expertise = validated_data.pop('expertise', [])
        languages = validated_data.pop('languages', [])
        payment_methods = validated_data.pop('payment_methods', [])

        experience = Experience.objects.create(**validated_data)

        experience.expertise.set(expertise)
        experience.languages.set(languages)
        experience.payment_methods.set(payment_methods)

        return experience

    def update(self, instance, validated_data):
        expertise = validated_data.pop('expertise', None)
        languages = validated_data.pop('languages', None)
        payment_methods = validated_data.pop('payment_methods', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if expertise is not None:
            instance.expertise.set(expertise)
        if languages is not None:
            instance.languages.set(languages)
        if payment_methods is not None:
            instance.payment_methods.set(payment_methods)

        return instance

class ExperienceSlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExperienceSlot
        fields = '__all__'
        read_only_fields = ['id', 'experience', 'remaining_slots']

    def validate(self, data):
        if self.instance is None:
            data['remaining_slots'] = data.get('capacity')

        if self.instance is not None:
            new_capacity = data.get('capacity', self.instance.capacity)
            booked = self.instance.capacity - self.instance.remaining_slots
            if new_capacity < booked:
                raise serializers.ValidationError(
                    {"capacity": f"Cannot set capacity below already-booked slots ({booked})."}
                )
            data['remaining_slots'] = new_capacity - booked

        return data

    def validate_date(self, value):
        from django.utils import timezone
        if value < timezone.now().date():
            raise serializers.ValidationError("Slot date cannot be in the past.")
        return value

class ExperienceListSerializer(serializers.ModelSerializer):
    location = LocationSerializer(read_only=True)
    guide_name = serializers.CharField(source='guide.username', read_only=True)

    origin_lang = LanguageSerializer(read_only=True)

    average_rating = serializers.SerializerMethodField()
    reviews_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Experience
        fields = [
            'id', 'title', 'description', 'location', 'guide_name', 'photos',
            'average_rating', 'reviews_count', 'is_active', 'created_at', 'origin_lang'
        ]

    def get_average_rating(self, obj):
        return round(obj.average_rating or 0, 1)
