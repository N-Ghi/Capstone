from django.db import transaction
from Booking.models import Booking
from .models import Payout
from Choices.models import PayoutStatus
from Profile.models import Guide
from .serializers import PayoutSerializer
from .services.mock_payout import MockPayoutService
from Utils.system_info import get_system_setting



def create_payouts_for_completed_bookings():
    pending_status = PayoutStatus.objects.get(code='PENDING')
    fee_rate = float(get_system_setting("PlatformFee", 0.10))

    completed_bookings = Booking.objects.filter(
        status=Booking.Status.COMPLETED,
    ).exclude(
        payouts__isnull=False
    ).select_related('slot__experience__guide')

    for booking in completed_bookings:
        guide = booking.slot.experience.guide if booking.slot else None
        if not guide:
            continue

        net_amount = round(float(booking.total_price) * (1 - fee_rate), 2)

        with transaction.atomic():
            Payout.objects.get_or_create(
                booking=booking,
                defaults={
                    'guide': guide,
                    'amount': net_amount,
                    'status': pending_status,
                }
            )

def process_pending_payouts():
    pending_status = PayoutStatus.objects.get(code='PENDING')
    processing_status = PayoutStatus.objects.get(code='PROCESSING')
    failed_status = PayoutStatus.objects.get(code='FAILED')

    payouts = Payout.objects.filter(status=pending_status).select_related('guide')

    for payout in payouts:
        profile = PayoutSerializer().get_guide_detail(payout)
        phone_number = profile.phone_number if profile else None

        if not phone_number:
            # Leave as PENDING until the guide adds a phone number
            continue

        # Only lock once we know we can actually process it
        payout.status = processing_status
        payout.save(update_fields=['status', 'updated_at'])

        try:
            MockPayoutService.process_payout(payout, phone_number)
        except Exception:
            payout.status = failed_status
            payout.save(update_fields=['status', 'updated_at'])
