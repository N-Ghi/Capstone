from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Payment
from Choices.models import PaymentMethod, MobileProvider, PaymentStatus
from .services.mock_payment import MockPaymentService
from .serializers import PaymentSerializer
from Booking.utils import send_booking_notifications


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    def get_queryset(self):
        user = self.request.user
        return Payment.objects.filter(booking__traveler=user)

    @action(detail=True, methods=["post"], url_path="pay")
    def pay(self, request, pk=None):
        payment = get_object_or_404(Payment, id=pk)

        if payment.booking.traveler != request.user:
            return Response(
                {"detail": "Not authorized to pay for this booking."},
                status=status.HTTP_403_FORBIDDEN
            )

        method_id = request.data.get("method_id")
        provider_id = request.data.get("provider_id")
        number = request.data.get("number")

        if not method_id or not number:
            return Response(
                {"detail": "method_id and number are required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Safely get method and provider
        method = get_object_or_404(PaymentMethod, id=method_id)
        provider = get_object_or_404(MobileProvider, id=provider_id) if provider_id else None
        
        # Process payment
        result = MockPaymentService.process_payment(payment, method, number, provider)

        booking = payment.booking
        if result.get("status") == "COMPLETED":
            send_booking_notifications(booking)

        return Response({
            "payment": PaymentSerializer(payment).data,
            "payment_status": payment.payment_status.code,
            "booking_status": booking.status,
            "transaction_id": payment.provider_payment_id,
        }, status=status.HTTP_200_OK)
