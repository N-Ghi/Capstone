from django.urls import path
from .views import user_list, user_detail, user_update, user_delete
from .auth import register, login, verify_email
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('auth/create/', register, name='register'),
    path('auth/verify-email/<uidb64>/<token>/', verify_email, name='verify-email'),
    path('auth/login/', login, name='login'),
    path("auth/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path('all/', user_list, name='user-list'),
    path('get/<uuid:user_id>/', user_detail, name='user-detail'),
    path('update/<uuid:user_id>/', user_update, name='user-update'),
    path('delete/<uuid:user_id>/', user_delete, name='user-delete'),
]