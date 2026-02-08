import uuid
from django.db import models
from django.contrib.auth import get_user_model
from Choices.models import PaymentMethod, PaymentStatus, MobileProvider, PayoutStatus
from Booking.models import Booking

User = get_user_model()

class Payment(models.Model):
    """Model representing a payment made by a traveler for a booking."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name='payments')

    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_date = models.DateTimeField(auto_now_add=True)

    payment_method = models.ForeignKey( PaymentMethod, on_delete=models.PROTECT,
        related_name='payments', null=True, blank=True
    )

    payment_status = models.ForeignKey( PaymentStatus, on_delete=models.PROTECT,
        related_name='payments', null=True, blank=True
    )

    # Third-party provider integration
    provider = models.ForeignKey(MobileProvider, on_delete=models.PROTECT, related_name='payment_providers', null=True, blank=True)

    provider_payment_id = models.CharField(max_length=100, unique=True, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-payment_date']
    
    def __str__(self):
        return f"Payment {self.id} for Booking {self.booking.id}"

class Payout(models.Model):
    """Model representing a payout to a guide for a completed experience."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    guide = models.ForeignKey(User, on_delete=models.PROTECT, related_name='payouts')

    booking = models.ForeignKey(Booking, on_delete=models.PROTECT, related_name='payouts', null=True, blank=True)

    amount = models.DecimalField(max_digits=10, decimal_places=2)

    payout_date = models.DateTimeField(auto_now_add=True)

    status = models.ForeignKey(PayoutStatus, on_delete=models.PROTECT, null=True, blank=True)

    mobile_number = models.CharField(max_length=10, blank=True, null=True)

    # The guides' prefered mobile money provider (e.g., MTN, Airtel, etc.)
    mobile_provider = models.ForeignKey(MobileProvider, on_delete=models.PROTECT, related_name='payouts', null=True, blank=True)

    account_name = models.CharField(max_length=100, blank=True, null=True)


    # Third-party provider integration
    provider = models.ForeignKey(MobileProvider, on_delete=models.PROTECT, related_name='payout_providers', null=True, blank=True)
    
    provider_payout_id = models.CharField(max_length=100, unique=True, blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-payout_date']
        unique_together = ('booking', 'provider_payout_id')
    
    def __str__(self):
        return f"Payout {self.id} to Guide {self.guide.id} for Amount {self.amount}"