from rest_framework import serializers
from django.db import transaction
from django.utils import timezone
from .models import Booking
from Experiences.models import ExperienceSlot, Experience
from Experiences.serializers import ExperienceSlotSerializer


class BookingCreateSerializer(serializers.Serializer):
    """
    Handles booking creation with slot availability checks.
    """
    slot_id = serializers.UUIDField()
    guests = serializers.IntegerField(min_value=1)

    def validate(self, data):
        slot_id = data.get('slot_id')
        guests = data.get('guests')

        # Check slot exists and is active
        try:
            slot = ExperienceSlot.objects.select_related('experience').get(
                id=slot_id,
                is_active=True
            )
        except ExperienceSlot.DoesNotExist:
            raise serializers.ValidationError({"slot_id": "Invalid or inactive slot."})

        # Check experience is active
        if not slot.experience.is_active:
            raise serializers.ValidationError({"slot_id": "This experience is no longer available."})

        # Check slot date is in the future
        if slot.date < timezone.now().date():
            raise serializers.ValidationError({"slot_id": "Cannot book slots in the past."})

        # Check availability
        if slot.remaining_slots < guests:
            raise serializers.ValidationError({
                "guests": f"Only {slot.remaining_slots} slots remaining."
            })

        # Attach slot object for use in create()
        data['_slot'] = slot
        return data

    def create(self, validated_data):
        slot = validated_data['_slot']
        guests = validated_data['guests']
        traveler = self.context['request'].user

        # Create booking with snapshot data
        with transaction.atomic():
            # Lock the slot row to prevent race conditions
            slot = ExperienceSlot.objects.select_for_update().get(id=slot.id)

            # Double-check availability (in case of concurrent requests)
            if slot.remaining_slots < guests:
                raise serializers.ValidationError({
                    "guests": f"Only {slot.remaining_slots} slots remaining."
                })

            # Create booking
            booking = Booking.objects.create(
                traveler=traveler,
                slot=slot,
                guests=guests,
                experience_title=slot.experience.title,
                price_per_guest=slot.price,
                total_price=slot.price * guests,
                status=Booking.Status.PENDING
            )

            # Decrement slot availability
            slot.remaining_slots -= guests
            slot.save(update_fields=['remaining_slots'])

        return booking

class BookingSerializer(serializers.ModelSerializer):
    """
    Full booking details including related slot and experience info.
    """
    slot = ExperienceSlotSerializer(read_only=True)
    traveler_name = serializers.CharField(source='traveler.get_full_name', read_only=True)
    experience_id = serializers.UUIDField(source='slot.experience.id', read_only=True)
    experience_location = serializers.CharField(source='slot.experience.location.place_name', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'traveler', 'traveler_name', 'slot', 'guests',
            'experience_id', 'experience_title', 'experience_location',
            'price_per_guest', 'total_price', 'status',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'traveler', 'experience_title', 'price_per_guest',
            'total_price', 'created_at', 'updated_at'
        ]

class BookingListSerializer(serializers.ModelSerializer):
    """
    Lighter serializer for list views.
    """
    traveler_name = serializers.CharField(source='traveler.get_full_name', read_only=True)
    booking_date = serializers.DateField(source='slot.date', read_only=True)

    class Meta:
        model = Booking
        fields = [
            'id', 'traveler_name', 'experience_title',
            'booking_date', 'guests', 'total_price', 'status',
            'created_at'
        ]

class BookingStatusUpdateSerializer(serializers.Serializer):
    """
    Handles status transitions with business logic.
    """
    status = serializers.ChoiceField(choices=Booking.Status.choices)

    def validate_status(self, value):
        booking = self.context['booking']
        current_status = booking.status

        # Define allowed transitions
        ALLOWED_TRANSITIONS = {
            Booking.Status.PENDING: [Booking.Status.CONFIRMED, Booking.Status.CANCELLED, Booking.Status.EXPIRED],
            Booking.Status.CONFIRMED: [Booking.Status.CANCELLED, Booking.Status.COMPLETED],
            Booking.Status.CANCELLED: [],
            Booking.Status.COMPLETED: [],
            Booking.Status.EXPIRED: [],  
        }

        if value not in ALLOWED_TRANSITIONS.get(current_status, []):
            raise serializers.ValidationError(
                f"Cannot transition from {current_status} to {value}."
            )

        return value

    def update(self, instance, validated_data):
        new_status = validated_data['status']
        old_status = instance.status

        with transaction.atomic():
            # If cancelling, restore slot availability
            if new_status == Booking.Status.CANCELLED and old_status != Booking.Status.CANCELLED:
                slot = ExperienceSlot.objects.select_for_update().get(id=instance.slot.id)
                slot.remaining_slots += instance.guests
                slot.save(update_fields=['remaining_slots'])

            instance.status = new_status
            instance.save(update_fields=['status', 'updated_at'])

        return instance
