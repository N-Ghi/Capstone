from django.urls import path
from .views import user_list, user_detail, user_update, user_delete
from .auth import register, login, verify_email

urlpatterns = [
    path('auth/create/', register, name='register'),
    path('auth/verify-email/<uidb64>/<token>/', verify_email, name='verify-email'),
    path('auth/login/', login, name='login'),
    path('all/', user_list, name='user-list'),
    path('<int:pk>/', user_detail, name='user-detail'),
    path('update/<int:pk>/', user_update, name='user-update'),
    path('delete/<int:pk>/', user_delete, name='user-delete'),
]