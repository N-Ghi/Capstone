import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from Choices.models import BookingStatus
from Experiences.models import Experience

User = get_user_model()

class Booking(models.Model):
    """Model representing a booking made by a traveler for an experience."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    traveler = models.ForeignKey(User, on_delete=models.CASCADE, related_name='traveler_bookings')
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='experience_bookings')

    booking_date = models.DateTimeField(auto_now_add=True)

    status = models.ForeignKey( BookingStatus, on_delete=models.PROTECT, 
        related_name='bookings', null=True, blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-booking_date']
    
    def __str__(self):
        return f"Booking {self.id} by {self.traveler} for {self.experience}"