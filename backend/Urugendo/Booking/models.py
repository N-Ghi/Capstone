import uuid
from django.db import models
from django.contrib.auth import get_user_model
from Experiences.models import ExperienceSlot

User = get_user_model()

class Booking(models.Model):

    class Status(models.TextChoices):
        PENDING = "PENDING", "Pending"
        CONFIRMED = "CONFIRMED", "Confirmed"
        CANCELLED = "CANCELLED", "Cancelled"
        COMPLETED = "COMPLETED", "Completed"
        EXPIRED = "EXPIRED", "Expired"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    traveler = models.ForeignKey( User, on_delete=models.CASCADE,
        related_name="bookings"
    )

    slot = models.ForeignKey( ExperienceSlot, on_delete=models.PROTECT,
        related_name="bookings", null=True, blank=True
    )

    guests = models.PositiveIntegerField(default=1)

    # Snapshot fields. These capture the experience details at the time of booking.
    experience_title = models.CharField(max_length=100, default="")
    price_per_guest = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    total_price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

    status = models.CharField( max_length=20, choices=Status.choices, 
        default=Status.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=["status"]),
            models.Index(fields=["created_at"]),
        ]
