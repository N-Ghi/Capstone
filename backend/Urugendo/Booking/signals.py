from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Booking


@receiver(pre_save, sender=Booking)
def handle_booking_status_change(sender, instance, **kwargs):
    """
    When a booking is cancelled, immediately restore slot availability.
    """
    if not instance.pk:
        return  # new booking, nothing to restore

    try:
        previous = Booking.objects.get(pk=instance.pk)
    except Booking.DoesNotExist:
        return

    cancelling = (
        previous.status != Booking.Status.CANCELLED
        and instance.status == Booking.Status.CANCELLED
    )

    if cancelling and instance.slot:
        slot = instance.slot
        slot.remaining_slots = min(
            slot.remaining_slots + instance.guests,
            slot.capacity
        )
        slot.save(update_fields=['remaining_slots'])