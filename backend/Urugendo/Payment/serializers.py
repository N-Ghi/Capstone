from rest_framework import serializers
from Booking.models import Booking
from .models import Payment, Payout
from Profile.models import Guide
from Booking.serializers import BookingSerializer
from Choices.models import PayoutStatus
from Choices.serializers import PaymentMethodSerializer, PaymentStatusSerializer, MobileProviderSerializer
from django.contrib.auth import get_user_model
from Utils.system_info import get_system_setting

User = get_user_model()

class PaymentSerializer(serializers.ModelSerializer):
    booking = BookingSerializer(read_only=True)
    payment_method = PaymentMethodSerializer(read_only=True)
    payment_status = PaymentStatusSerializer(read_only=True)
    provider = MobileProviderSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['id', 'payment_date', 'created_at', 'updated_at']

class PayoutSerializer(serializers.ModelSerializer):
    guide = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    guide_profile_id = serializers.PrimaryKeyRelatedField(
        queryset=Guide.objects.all(), source='guide_profile', write_only=True, required=False, allow_null=True
    ) 
    booking = serializers.PrimaryKeyRelatedField(queryset=Booking.objects.all(), required=False, allow_null=True)
    status = serializers.PrimaryKeyRelatedField(queryset=PayoutStatus.objects.all(), required=False, allow_null=True)

    # Read-only nested representations
    guide_detail = serializers.SerializerMethodField(read_only=True)
    guide_profile = serializers.SerializerMethodField(read_only=True)
    status_detail = serializers.SerializerMethodField(read_only=True)
    booking_detail = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Payout
        fields = '__all__'
        read_only_fields = ['id', 'payout_date', 'created_at', 'updated_at']


    def get_booking_detail(self, obj):
        if not obj.booking:
            return None
        total = obj.booking.total_price
        fee_rate = float(get_system_setting("PlatformFee", 0.10))
        platform_fee = round(float(total) * fee_rate, 2)
        return {
            'experience_title': obj.booking.experience_title,
            'slot_date': str(obj.booking.slot.date) if obj.booking.slot else None,
            'slot_start_time': str(obj.booking.slot.start_time) if obj.booking.slot else None,
            'slot_end_time': str(obj.booking.slot.end_time) if obj.booking.slot else None,
            'total_price': str(total),
            'platform_fee': str(platform_fee),
        }

    def get_guide_detail(self, obj):
        return {
            'id': str(obj.guide.id),
            'email': obj.guide.email,
            'username': obj.guide.username,
        }
    
    def get_guide_profile(self, obj):
        try:
            profile = obj.guide.guide_profile
            return {
                "phone_number": profile.phone_number,
                "payout_provider": {
                    "id": str(profile.payout_provider.id),
                    "name": profile.payout_provider.name,
                } if profile.payout_provider else None
            }
        except Guide.DoesNotExist:
            return {"phone_number": None, "payout_provider": None}

    def get_status_detail(self, obj):
        if obj.status:
            return {'id': obj.status.id, 'code': obj.status.code}
        return None
