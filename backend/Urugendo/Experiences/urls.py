from .views import create_experience, get_experiences, get_experience, update_experience, delete_experience
from django.urls import path

urlpatterns = [
    path('create/', create_experience, name='create_experience'),
    path('get_experiences/', get_experiences, name='get_experiences'),
    path('get/<uuid:experience_id>/', get_experience, name='get_experience'),
    path('update/<uuid:experience_id>/', update_experience, name='update_experience'),
    path('delete/<uuid:experience_id>/', delete_experience, name='delete_experience'),
]