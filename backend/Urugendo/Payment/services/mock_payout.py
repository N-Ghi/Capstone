import uuid
from Choices.models import PayoutStatus, MobileProvider
from Payment.models import Payout

# Mock responses by mobile number
PAYOUT_STATUS_MAP = {
    # MTN
    "0780000001": "FAILED",
    "0780000002": "PAID",
    "0780000003": "FAILED",
    # Airtel
    "0730000001": "FAILED",
    "0730000002": "PAID",
    "0730000003": "FAILED",
}

class MockPayoutService:
    @staticmethod
    def process_payout(payout: Payout, phone_number: str):
        """
        Simulate disbursing a payout to a guide via mobile money.
        """
        status_str = PAYOUT_STATUS_MAP.get(phone_number, "PAID")

        payout.status = PayoutStatus.objects.get(code=status_str)
        payout.provider_payout_id = f"mock_{uuid.uuid4()}"
        payout.save(update_fields=['status', 'provider_payout_id', 'updated_at'])

        return {
            "status": status_str,
            "payout_id": str(payout.id),
            "guide_id": str(payout.guide.id),
            "amount": str(payout.amount),
            "transaction_id": payout.provider_payout_id,
        }