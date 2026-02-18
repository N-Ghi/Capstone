from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
import uuid

class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, username, email=None, password=None, **extra_fields):
        if not username:
            raise ValueError("The Username must be set")
        email = self.normalize_email(email)
        user = self.model(username=username, email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, username, email=None, password=None, **extra_fields):
        # Force superuser defaults
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'Admin')

        return self.create_user(username, email, password, **extra_fields)

class User(AbstractUser):
    class Role(models.TextChoices):
        ADMIN = 'Admin', 'Admin'
        TOURIST = 'Tourist', 'Tourist'
        GUIDE = 'Guide', 'Guide'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role = models.CharField(max_length=20, choices=Role.choices, default=Role.TOURIST)
    profile_picture = models.URLField(blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    objects = UserManager()

    def __str__(self):
        return self.username

class GoogleOAuthToken(models.Model):
    """Stores per-user Google OAuth2 tokens for Calendar access."""
    user = models.OneToOneField( User, on_delete=models.CASCADE,
        related_name="google_token",
    )
    access_token = models.TextField()
    refresh_token = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"GoogleOAuthToken({self.user.email})"

    class Meta:
        db_table = 'users_google_oauth_token'
        verbose_name = 'Google OAuth Token'
        verbose_name_plural = 'Google OAuth Tokens'
