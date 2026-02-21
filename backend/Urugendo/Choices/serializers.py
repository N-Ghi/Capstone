from rest_framework import serializers
from .models import PaymentMethod, TravelPreference, Language, PaymentStatus, MobileProvider, PayoutStatus

class LabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = None
        fields = ['id', 'name']

class PaymentMethodSerializer(LabelSerializer):
    class Meta(LabelSerializer.Meta):
        model = PaymentMethod
        fields = ['id', 'name']

class TravelPreferenceSerializer(LabelSerializer):
    class Meta(LabelSerializer.Meta):
        model = TravelPreference
        fields = ['id', 'name']

class LanguageSerializer(LabelSerializer):
    class Meta(LabelSerializer.Meta):
        model = Language
        fields = ['id', 'name', 'code']

class PaymentStatusSerializer(LabelSerializer):
    class Meta(LabelSerializer.Meta):
        model = PaymentStatus
        fields = ['id', 'code']

class MobileProviderSerializer(LabelSerializer):
    class Meta(LabelSerializer.Meta):
        model = MobileProvider
        fields = ['id', 'name']

class PayoutStatusSerializer(LabelSerializer):
    class Meta(LabelSerializer.Meta):
        model = PayoutStatus
        fields = ['id', 'code']