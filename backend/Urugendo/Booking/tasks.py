from django.utils import timezone
from .models import Booking
from Experiences.models import ExperienceSlot


def expire_pending_bookings():
    """
    Expire PENDING bookings whose slot date+time has passed.
    Restores remaining_slots on the associated ExperienceSlot.
    """
    now = timezone.now()

    stale_bookings = Booking.objects.filter(
        status=Booking.Status.PENDING,
        slot__date__lt=now.date(),
    ).select_related('slot')

    for booking in stale_bookings:
        booking.status = Booking.Status.EXPIRED
        booking.save(update_fields=['status', 'updated_at'])

        # Restore slot availability
        slot = booking.slot
        if slot:
            slot.remaining_slots = min(
                slot.remaining_slots + booking.guests,
                slot.capacity
            )
            slot.save(update_fields=['remaining_slots'])


def complete_confirmed_bookings():
    """
    Mark CONFIRMED bookings as COMPLETED once their slot end time has passed.
    """
    now = timezone.now()

    confirmed_bookings = Booking.objects.filter(
        status=Booking.Status.CONFIRMED,
        slot__date__lte=now.date(),
    ).select_related('slot')

    for booking in confirmed_bookings:
        slot = booking.slot
        if not slot:
            continue

        # Timezone-aware datetime from slot date + end_time
        slot_end = timezone.make_aware(
            timezone.datetime.combine(slot.date, slot.end_time)
        )

        if now >= slot_end:
            booking.status = Booking.Status.COMPLETED
            booking.save(update_fields=['status', 'updated_at'])


def deactivate_past_slots():
    """
    Set is_active=False on ExperienceSlots whose date has passed.
    """
    today = timezone.now().date()

    ExperienceSlot.objects.filter(
        date__lt=today,
        is_active=True,
    ).update(is_active=False)