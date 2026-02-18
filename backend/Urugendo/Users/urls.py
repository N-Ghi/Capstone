from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet
from .auth import register, login, resend_verification_email, verify_email
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'', UserViewSet, basename='user')

urlpatterns = [
    # Auth endpoints
    path('auth/create/', register, name='register'),
    path('auth/verify-email/<uidb64>/<token>/', verify_email, name='verify-email'),
    path('auth/resend-verification-email/', resend_verification_email, name='resend-verification-email'),
    path('auth/login/', login, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # UserViewSet routes via router
    path('', include(router.urls)),
]