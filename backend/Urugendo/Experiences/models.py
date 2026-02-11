import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from Choices.models import PaymentMethod, TravelPreference, Language
from Location.models import GeoLocation

User = get_user_model()

class Experience(models.Model):
    """Model representing a travel experience."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    guide = models.ForeignKey(User, on_delete=models.CASCADE, related_name='guide_experiences')

    title = models.CharField(max_length=100, default='Experience Title')

    description = models.TextField(max_length=1000, default='Experience Description')

    expertise = models.ManyToManyField(TravelPreference, blank=True)

    price = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    location = models.OneToOneField( GeoLocation, on_delete=models.SET_NULL, null=True,
        blank=True, related_name='experience_location'
    )
    photos = ArrayField(models.URLField(blank=True), blank=True, default=list)

    languages = models.ManyToManyField(Language, blank=True)

    payment_methods = models.ManyToManyField(PaymentMethod, blank=True)

    class Meta:
        ordering = ['-id']
    
    def __str__(self):
        return f"{self.title} by {self.guide}"