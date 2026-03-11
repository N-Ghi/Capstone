import uuid
from django.db import models
from django.contrib.auth import get_user_model
from Choices.models import PaymentMethod, TravelPreference, Language, MobileProvider

User = get_user_model()


class Tourist(models.Model):
    """Model representing a tourist profile."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user_id = models.OneToOneField(User, on_delete=models.CASCADE,  related_name='tourist_profile')
    
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

    user_id = models.OneToOneField(User, on_delete=models.CASCADE,  related_name='guide_profile')

    phone_number = models.CharField(max_length=10, blank=False, null=False, default='0780000002')

    payout_provider = models.ForeignKey(MobileProvider, on_delete=models.SET_NULL, null=True, blank=True, related_name='guide_payout_provider')

    bio = models.TextField(blank=False, max_length=1000, default='')

    languages = models.ManyToManyField( Language, blank=True )

    class Meta:
        ordering = ['-id']
    
    def __str__(self):
        return f"{self.user_id} -> Guide Profile"

class Admin(models.Model):
    """Model representing an admin profile."""
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user_id = models.OneToOneField(User, on_delete=models.CASCADE,  related_name='admin_profile')

       
    class Meta:
        ordering = ['-id']
    
    def __str__(self):
        return f"{self.user_id} -> Admin Profile"
