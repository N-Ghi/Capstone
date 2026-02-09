from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'Admin', 'Admin'
        TOURIST = 'Tourist', 'Tourist'
        GUIDE = 'Guide', 'Guide'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField( max_length=20, choices=Role.choices, default=Role.TOURIST)
    profile_picture = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)
