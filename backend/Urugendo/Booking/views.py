from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.contrib.auth import get_user_model
from Utils.email import send_booking_pending_alert, send_booking_cancellation, send_cancellation_alert
from .models import Booking
from Payment.models import Payment
from Choices.models import PaymentStatus
from .serializers import ( BookingCreateSerializer, BookingSerializer, BookingListSerializer, BookingStatusUpdateSerializer )


User = get_user_model()


class BookingViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing bookings.
    
    PERMISSIONS:
    - CREATE: Admin (for any tourist) or Tourist (for themselves)
    - RETRIEVE: Admin or owner tourist
    - LIST: Admin (all), Guide (bookings for their experiences), Tourist (their own)
    - UPDATE/STATUS: Admin or owner guide
    - DELETE/CANCEL: Admin or owner tourist
    """
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user

        if user.role == 'Admin':
            return Booking.objects.select_related(
                'traveler', 'slot', 'slot__experience', 'slot__experience__guide',
                'slot__experience__location'
            ).all().order_by('-created_at')

        if user.role == 'Guide':
            return Booking.objects.select_related(
                'traveler', 'slot', 'slot__experience', 'slot__experience__location'
            ).filter(slot__experience__guide=user).order_by('-created_at')

        return Booking.objects.select_related(
            'slot', 'slot__experience', 'slot__experience__guide',
            'slot__experience__location'
        ).filter(traveler=user).order_by('-created_at')
    
    def get_serializer_class(self):
        if self.action == 'create':
            return BookingCreateSerializer
        if self.action == 'list':
            return BookingListSerializer
        return BookingSerializer
    
    def create(self, request, *args, **kwargs):
        user = request.user

        # Guides cannot create bookings
        if user.role == "Guide":
            return Response({"detail": "Guides cannot create bookings."}, status=status.HTTP_403_FORBIDDEN)

        # Determine traveler
        if user.role == "Admin":
            tourist_id = request.data.get("tourist_id")
            if not tourist_id:
                return Response({"tourist_id": "Required for admin to create bookings."}, status=status.HTTP_400_BAD_REQUEST)
            traveler = get_object_or_404(User, id=tourist_id, role="Tourist")
        else:
            traveler = user

        # Create booking with PENDING status
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        booking.traveler = traveler
        booking.status = Booking.Status.PENDING
        booking.save()

        # Create associated payment (PENDING)
        payment = Payment.objects.create(
            booking=booking,
            amount=booking.slot.price * booking.guests,
            payment_status=PaymentStatus.objects.get(code="PENDING")
        )

        # Send pending alert emails
        try:
            send_booking_pending_alert(
                to=traveler.email,
                tourist_name=traveler.get_full_name(),
                experience_title=booking.experience_title,
                booking_date=booking.slot.date.strftime("%B %d, %Y"),
                start_time=booking.slot.start_time.strftime("%I:%M %p"),
                end_time=booking.slot.end_time.strftime("%I:%M %p"),
            )
        except Exception as e:
            print(f"Failed to send pending booking emails: {e}")

        response_data = BookingSerializer(booking).data
        response_data["payment_id"] = str(payment.id)
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    def retrieve(self, request, *args, **kwargs):
        """
        GET /bookings/{id}/
        
        - Admin: Can view any booking
        - Tourist: Can only view their own bookings
        - Guide: Cannot view individual bookings directly
        """
        booking = self.get_object()
        user = request.user
        
        # Permission check
        if user.role == 'Admin' or user == booking.traveler:
            serializer = self.get_serializer(booking)
            return Response(serializer.data)
        
        return Response(
            {"detail": "You don't have permission to view this booking."},
            status=status.HTTP_403_FORBIDDEN
        )
    
    def list(self, request, *args, **kwargs):
        """
        GET /bookings/
        
        - Admin: All bookings
        - Guide: Bookings for their experiences
        - Tourist: Their own bookings
        """
        return super().list(request, *args, **kwargs)
    
    @action(detail=False, methods=['get'], url_path='slot/(?P<slot_id>[^/.]+)')
    def by_slot(self, request, slot_id=None):
        """
        GET /bookings/slot/{slot_id}/
        Get all bookings for a specific slot.
        
        - Admin: Can view bookings for any slot
        - Guide: Can only view bookings for their own experience slots
        - Tourist: Cannot access this endpoint
        """
        user = request.user
        
        if user.role == 'Tourist':
            return Response(
                {"detail": "Tourists cannot view slot bookings."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        from Experiences.models import ExperienceSlot
        
        try:
            slot = ExperienceSlot.objects.select_related('experience').get(id=slot_id)
        except ExperienceSlot.DoesNotExist:
            return Response(
                {"detail": "Slot not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Guide can only see bookings for their own experiences
        if user.role == 'Guide' and slot.experience.guide != user:
            return Response(
                {"detail": "You can only view bookings for your own experiences."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        bookings = Booking.objects.filter(slot=slot).select_related(
            'traveler', 'slot', 'slot__experience'
        )
        
        serializer = BookingListSerializer(bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=["patch"], url_path="status")
    def update_status(self, request, pk=None):
        """
        PATCH /bookings/{id}/status/
        Used by backend/payment webhook to mark booking CONFIRMED after payment success.
        """
        booking = self.get_object()
        serializer = BookingStatusUpdateSerializer(
            data=request.data, context={"booking": booking}
        )
        serializer.is_valid(raise_exception=True)
        serializer.update(booking, serializer.validated_data)

        return Response(BookingSerializer(booking).data)
    
    def destroy(self, request, *args, **kwargs):
        """
        DELETE /bookings/{id}/
        Cancel a booking (changes status to CANCELLED).
        
        - Admin: Can cancel any booking
        - Tourist: Can only cancel their own bookings
        - Guide: Cannot cancel bookings
        """
        booking = self.get_object()
        user = request.user
        
        # Permission check
        if user.role == 'Guide':
            return Response(
                {"detail": "Guides cannot cancel bookings. Use status update instead."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        if user.role != 'Admin' and user != booking.traveler:
            return Response(
                {"detail": "You can only cancel your own bookings."},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Check if booking can be cancelled
        if booking.status in [Booking.Status.CANCELLED, Booking.Status.COMPLETED, Booking.Status.EXPIRED]:
            return Response(
                {"detail": f"Cannot cancel a booking with status: {booking.status}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update status to CANCELLED
        serializer = BookingStatusUpdateSerializer(
            data={'status': Booking.Status.CANCELLED},
            context={'booking': booking}
        )
        serializer.is_valid(raise_exception=True)
        serializer.update(booking, serializer.validated_data)
        
        # TODO: Add job for sending refunds

        # Send cancellation alert to tourist
        try:
            send_booking_cancellation(
                to=booking.traveler.email,
                tourist_name=booking.traveler.get_full_name(),
                experience_title=booking.experience_title,
                booking_date=booking.slot.date.strftime("%B %d, %Y")
            )
        except Exception as e:
            print(f"Failed to send cancellation email: {e}")

        # Send cancelation alert to guide
        try:
            send_cancellation_alert(
                to=booking.slot.experience.guide.email,
                guide_name=booking.slot.experience.guide.get_full_name(),
                tourist_name=booking.traveler.get_full_name(),
                experience_title=booking.experience_title,
                booking_date=booking.slot.date.strftime("%B %d, %Y")
            )
        except Exception as e:
            print(f"Failed to send cancellation alert: {e}")
            

        
        return Response(
            {"detail": "Booking cancelled successfully."},
            status=status.HTTP_200_OK
        )
    
    @action(detail=False, methods=['get'], url_path='upcoming')
    def upcoming(self, request):
        """
        GET /bookings/upcoming/
        List upcoming bookings (confirmed, slot date in future).
        """
        from django.utils import timezone
        
        upcoming_bookings = self.get_queryset().filter(
            status=Booking.Status.CONFIRMED,
            slot__date__gte=timezone.now().date()
        ).order_by('slot__date')
        
        serializer = BookingListSerializer(upcoming_bookings, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='past')
    def past(self, request):
        """
        GET /bookings/past/
        List past bookings (completed or slot date in past).
        """
        from django.utils import timezone
        
        past_bookings = self.get_queryset().filter(
            Q(status=Booking.Status.COMPLETED) |
            Q(slot__date__lt=timezone.now().date())
        ).order_by('-slot__date')
        
        serializer = BookingListSerializer(past_bookings, many=True)
        return Response(serializer.data)
