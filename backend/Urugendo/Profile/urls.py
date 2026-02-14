from .views import create_profile, get_profile, update_profile, delete_profile, get_profiles
from django.urls import path

urlpatterns = [
    path('create/', create_profile, name='create_profile'),
    path('get_profiles/', get_profiles, name='get_profiles'),
    path('get/<uuid:user_id>/', get_profile, name='get_profile'),
    path('update/<uuid:user_id>/', update_profile, name='update_profile'),
    path('delete/<uuid:user_id>/', delete_profile, name='delete_profile'),
]