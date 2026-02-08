import uuid
from django.db import models
from django.contrib.auth import get_user_model
from Experiences.models import Experience


User = get_user_model()

class Review(models.Model):
    """Model representing a review left by a traveler for an experience."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    traveler = models.ForeignKey(User, on_delete=models.CASCADE, related_name='traveler_reviews')

    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='experience_reviews')

    rating = models.PositiveSmallIntegerField(
        choices=[(1, "1"), (2, "2"), (3, "3"), (4, "4"), (5, "5")],
        null=True, blank=True
    )

    comment = models.TextField(max_length=1000, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('traveler', 'experience')
    
    def __str__(self):
        return f"Review {self.id} by {self.traveler} for {self.experience} - Rating: {self.rating if self.rating else 'N/A'}"