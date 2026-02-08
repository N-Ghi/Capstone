from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'Admin', 'Admin'
        TOURIST = 'Tourist', 'Tourist'
        GUIDE = 'Guide', 'Guide'

    role = models.CharField( max_length=20, choices=Role.choices, default=Role.TOURIST)
    profile_picture = models.URLField(blank=True, null=True)