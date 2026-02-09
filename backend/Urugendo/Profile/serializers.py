from rest_framework import serializers
from .models import Tourist, Guide, Admin
from Choices.models import TravelPreference, PaymentMethod, Language


class TouristSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tourist
        fields = [
            'id', 'user_id', 'travel_preferences', 'payment_methods',
            'languages',
        ]
        read_only_fields = ['id']

    # Field-level validation
    def validate_user_id(self, value):
        if Tourist.objects.filter(user_id=value).exclude(id=self.instance.id if self.instance else None).exists():
            raise serializers.ValidationError("This user already has a tourist profile.")
        return value

    # Object-level validation
    def validate(self, data):
        # Tourist must have at least one language
        languages = data.get('languages')
        if languages is not None and len(languages) == 0:
            raise serializers.ValidationError("A tourist must have at least one language.")
        
        # Tourist must have at least one travel preference
        travel_preferences = data.get('travel_preferences')
        if travel_preferences is not None and len(travel_preferences) == 0:
            raise serializers.ValidationError("A tourist must have at least one prefferred travel preference.")
        
        # Tourist must have at least one payment method
        payment_methods = data.get('payment_methods')
        if payment_methods is not None and len(payment_methods) == 0:
            raise serializers.ValidationError("A tourist must have at least one prefferred payment method.")
        return data
    

    # Create method
    def create(self, validated_data):
        travel_preferences = validated_data.pop('travel_preferences', [])
        payment_methods = validated_data.pop('payment_methods', [])
        languages = validated_data.pop('languages', [])

        tourist = Tourist.objects.create(**validated_data)

        tourist.travel_preferences.set(travel_preferences)
        tourist.payment_methods.set(payment_methods)
        tourist.languages.set(languages)

        return tourist

    # Update method
    def update(self, instance, validated_data):
        travel_preferences = validated_data.pop('travel_preferences', None)
        payment_methods = validated_data.pop('payment_methods', None)
        languages = validated_data.pop('languages', None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if travel_preferences is not None:
            instance.travel_preferences.set(travel_preferences)
        if payment_methods is not None:
            instance.payment_methods.set(payment_methods)
        if languages is not None:
            instance.languages.set(languages)

        return instance