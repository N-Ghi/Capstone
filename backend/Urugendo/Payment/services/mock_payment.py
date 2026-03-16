import uuid
from Choices.models import PaymentStatus, PaymentMethod, MobileProvider
from Payment.models import Payment

STATUS_MAP = {
    # MTN
    "0780000001": "FAILED",
    "0780000002": "COMPLETED",
    "0780000003": "FAILED",
    "0780000004": "REFUNDED",
    # Airtel
    "0730000001": "FAILED",
    "0730000002": "COMPLETED",
    "0730000003": "FAILED",
    "0730000004": "REFUNDED",
    # Credit Card
    "4111111111111111": "FAILED",
    "4111111111111112": "COMPLETED",
    "4111111111111113": "FAILED",
    "4111111111111114": "REFUNDED",
    # Debit Card
    "5500000000000001": "FAILED",
    "5500000000000002": "COMPLETED",
    "5500000000000003": "FAILED",
    "5500000000000004": "REFUNDED",
}

class MockPaymentService:
    @staticmethod
    def process_payment(payment: Payment, method: PaymentMethod, number: str, provider: MobileProvider = None):
        # Determine status
        status_str = STATUS_MAP.get(number, "COMPLETED")
        payment_method = method
        payment_provider = provider

        payment.payment_method = payment_method
        payment.provider = payment_provider
        payment.payment_status = PaymentStatus.objects.get(code=status_str)
        payment.provider_payment_id = f"mock_{uuid.uuid4()}"
        payment.save()

        # Update booking status
        booking = payment.booking
        if status_str == "COMPLETED":
            booking.status = "CONFIRMED"
        elif status_str in ["FAILED", "REFUNDED"]:
            booking.status = "PENDING"
        booking.save()

        return {
            "status": status_str,
            "payment_id": payment.id,
            "booking_id": booking.id,
            "transaction_id": payment.provider_payment_id
        }
