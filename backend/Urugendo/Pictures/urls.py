from django.urls import path
from .views import upload_profile_image, upload_experience_image

urlpatterns = [
    path('upload/profile/', upload_profile_image, name='upload-profile-image'),
    path('upload/experience/', upload_experience_image, name='upload-experience-image'),
]