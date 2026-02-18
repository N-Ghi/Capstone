import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from Choices.models import PaymentMethod, TravelPreference, Language
from Location.models import Location

User = get_user_model()


class Experience(models.Model):
    """Model representing a travel experience."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    guide = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guide_experiences')

    title = models.CharField(max_length=100, default='Experience Title')

    description = models.TextField(max_length=1000, default='Experience Description')

    expertise = models.ManyToManyField(TravelPreference, blank=True)

    location = models.ForeignKey( Location, on_delete=models.SET_NULL,
        null=True, blank=True, related_name='experiences'
    )
    
    photos = ArrayField(models.URLField(blank=True), blank=True, default=list)

    languages = models.ManyToManyField(Language, blank=True)

    payment_methods = models.ManyToManyField(PaymentMethod, blank=True)

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.title} by {self.guide}"

class ExperienceSlot(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    experience = models.ForeignKey( Experience, on_delete=models.CASCADE,
        related_name="slots"
    )

    date = models.DateField()

    start_time = models.TimeField(default="09:00:00")
    end_time = models.TimeField(default="12:00:00")

    capacity = models.PositiveIntegerField()
    remaining_slots = models.PositiveIntegerField()

    price = models.DecimalField(max_digits=10, decimal_places=2)

    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ("experience", "date")
        indexes = [
            models.Index(fields=["date"]),
            models.Index(fields=["is_active", "date"]),
        ]
    
    def __str__(self):
        return f"{self.experience.title} - {self.date} ({self.remaining_slots}/{self.capacity})"