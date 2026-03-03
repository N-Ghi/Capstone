# Payment/serializers.py
from rest_framework import serializers
from .models import Payment
from Booking.serializers import BookingSerializer
from Choices.models import PaymentMethod, PaymentStatus, MobileProvider
from Choices.serializers import PaymentMethodSerializer, PaymentStatusSerializer, MobileProviderSerializer


class PaymentSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    payment_method = PaymentMethodSerializer(read_only=True)
    payment_status = PaymentStatusSerializer(read_only=True)
    provider = MobileProviderSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['id', 'payment_date', 'created_at', 'updated_at']