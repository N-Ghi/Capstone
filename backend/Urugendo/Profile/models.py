import uuid
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.postgres.fields import ArrayField
from Choices.models import PaymentMethod, TravelPreference, Language, Location


User = get_user_model()


class Tourist(models.Model):
    """Model representing a tourist profile."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user_id = models.ForeignKey(User, on_delete=models.CASCADE,  related_name='tourist_profile')
    
    travel_preferences = models.ManyToManyField( TravelPreference, blank=True )

    payment_methods = models.ManyToManyField( PaymentMethod, blank=True )
    languages = models.ManyToManyField( Language, blank=True )
    
    class Meta:
        ordering = ['-id']
    
    def __str__(self):
        return f"{self.user_id} -> Tourist Profile"
    
class Guide(models.Model):
    """Model representing a guide profile."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user_id = models.ForeignKey(User, on_delete=models.CASCADE,  related_name='guide_profile')

    name = models.CharField(max_length=100, blank=False, default='Guide Name')

    bio = models.TextField(blank=False, max_length=1000, default='')

    languages = models.ManyToManyField( Language, blank=True )

    payment_methods = models.ManyToManyField( PaymentMethod, blank=True )

    expertise = models.ManyToManyField( TravelPreference, blank=True )
    
    location = models.ManyToManyField( Location, blank=True )

    # Default map link points to Kigali, Rwanda. In a real application, this would be provided by the guide.
    map_link = models.URLField(blank=False, null=False, default='https://www.google.com/maps/place/Kigali,+Rwanda/@-1.9705796,30.0644358,11z')



    class Meta:
        ordering = ['-id']
    
    def __str__(self):
        return f"{self.user_id} -> Guide Profile"

class Admin(models.Model):
    """Model representing an admin profile."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user_id = models.ForeignKey(User, on_delete=models.CASCADE,  related_name='admin_profile')
       
    class Meta:
        ordering = ['-id']
    
    def __str__(self):
        return f"{self.user_id} -> Admin Profile"