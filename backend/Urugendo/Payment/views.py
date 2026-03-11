from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Payment, Payout
from Choices.models import PaymentMethod, MobileProvider, PayoutStatus
from .services.mock_payment import MockPaymentService
from .serializers import PaymentSerializer, PayoutSerializer
from Booking.utils import send_booking_notifications
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum, Count


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

class PayoutViewSet(viewsets.ModelViewSet):
    serializer_class = PayoutSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        qs = Payout.objects.select_related(
            'guide', 'booking', 'booking__slot', 'status', 'provider'
        )
        # Admins see all payouts; guides see only their own
        if not user.role == 'Admin':
            qs = qs.filter(guide=user)

        # Optional query param filters
        status_code = self.request.query_params.get('status')
        if status_code:
            qs = qs.filter(status__code=status_code)

        booking_id = self.request.query_params.get('booking')
        if booking_id:
            qs = qs.filter(booking_id=booking_id)

        return qs

    def perform_create(self, serializer):
        # If no guide is specified, default to the requesting user
        if not serializer.validated_data.get('guide'):
            serializer.save(guide=self.request.user)
        else:
            serializer.save()

    @action(detail=True, methods=['post'], url_path='mark-paid')
    def mark_paid(self, request, pk=None):
        """Shortcut action to mark a payout as paid."""
        payout = self.get_object()
        paid_status = PayoutStatus.objects.filter(name__iexact='paid').first()
        if not paid_status:
            return Response({'detail': 'Paid status not configured.'}, status=status.HTTP_400_BAD_REQUEST)
        payout.status = paid_status
        payout.save(update_fields=['status', 'updated_at'])
        return Response(PayoutSerializer(payout).data)

    @action(detail=False, methods=['get'], url_path='summary')
    def summary(self, request):
        """Return total payout amounts grouped by status for the current user."""
        qs = self.get_queryset()
        data = qs.values('status__name').annotate(
            total=Sum('amount'),
            count=Count('id')
        ).order_by('status__name')
        return Response(data)
