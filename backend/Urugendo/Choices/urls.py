from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PaymentMethodViewSet, TravelPreferenceViewSet, LanguageViewSet,
    PaymentStatusViewSet, MobileProviderViewSet, PayoutStatusViewSet
)

router = DefaultRouter()
router.register(r'payments', PaymentMethodViewSet, basename='payment-method')
router.register(r'travel_preferences', TravelPreferenceViewSet, basename='travel-preference')
router.register(r'languages', LanguageViewSet, basename='language')
router.register(r'payment_statuses', PaymentStatusViewSet, basename='payment-status')
router.register(r'mobile_providers', MobileProviderViewSet, basename='mobile-provider')
router.register(r'payout_statuses', PayoutStatusViewSet, basename='payout-status')

urlpatterns = [
    path('', include(router.urls)),
]