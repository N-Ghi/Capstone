import uuid
from django.db import models

class PaymentMethod(models.Model):
    """Model representing a payment method.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

class TravelPreference(models.Model):
    """Model representing a travel preference.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

class Language(models.Model):
    """Model representing a language.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    name = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.name

class PaymentStatus(models.Model):
    """Model representing a payment status.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.code
    
class BookingStatus(models.Model):
    """Model representing a booking status.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    
    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.code

class MobileProvider(models.Model):
    """Model representing a mobile money provider.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class PayoutStatus(models.Model):
    """Model representing the status of a payout to a guide.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    code = models.CharField(max_length=20, unique=True)

    def __str__(self):
        return self.code
