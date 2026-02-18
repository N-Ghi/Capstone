from rest_framework import viewsets, mixins
from rest_framework.permissions import AllowAny
from .models import PaymentMethod, TravelPreference, Language, PaymentStatus, MobileProvider, PayoutStatus
from .serializers import (
    PaymentMethodSerializer, TravelPreferenceSerializer, LanguageSerializer,
    PaymentStatusSerializer, MobileProviderSerializer, PayoutStatusSerializer
)


class ChoiceViewSet(mixins.ListModelMixin, viewsets.GenericViewSet):
    """
    Base read-only ViewSet for all choice/lookup models.
    Subclasses only need to define queryset and serializer_class.
    """
    permission_classes = [AllowAny]


class PaymentMethodViewSet(ChoiceViewSet):
    queryset = PaymentMethod.objects.all()
    serializer_class = PaymentMethodSerializer


class TravelPreferenceViewSet(ChoiceViewSet):
    queryset = TravelPreference.objects.all()
    serializer_class = TravelPreferenceSerializer


class LanguageViewSet(ChoiceViewSet):
    queryset = Language.objects.all()
    serializer_class = LanguageSerializer


class PaymentStatusViewSet(ChoiceViewSet):
    queryset = PaymentStatus.objects.all()
    serializer_class = PaymentStatusSerializer

class MobileProviderViewSet(ChoiceViewSet):
    queryset = MobileProvider.objects.all()
    serializer_class = MobileProviderSerializer


class PayoutStatusViewSet(ChoiceViewSet):
    queryset = PayoutStatus.objects.all()
    serializer_class = PayoutStatusSerializer
