from rest_framework import serializers
from .models import Review

class ReviewSerializer(serializers.ModelSerializer):

    class Meta:
        model = Review
        fields = '__all__'
        read_only_fields = ['id', 'traveler', 'created_at', 'updated_at']

    def validate(self, attrs):
        traveler = self.context.get('traveler')
        experience = attrs.get('experience')

        if self.instance is None and traveler and experience:
            if Review.objects.filter(traveler=traveler, experience=experience).exists():
                raise serializers.ValidationError(
                    "You have already reviewed this experience."
                )

        return attrs

    def create(self, validated_data):
        review = Review.objects.create(**validated_data)
        return review
    
    def update(self, instance, validated_data):
        instance.rating = validated_data.get('rating', instance.rating)
        instance.comment = validated_data.get('comment', instance.comment)
        instance.save()
        return instance