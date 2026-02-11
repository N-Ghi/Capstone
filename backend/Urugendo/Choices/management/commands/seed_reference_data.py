from django.core.management.base import BaseCommand
from Choices.models import ( PaymentMethod, TravelPreference, Language, PaymentStatus, BookingStatus, MobileProvider, PayoutStatus,
)

class Command(BaseCommand):
    help = "Seed reference tables with initial data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding reference data...")

        payment_methods = [
            "Mobile Money",
            "Credit Card",
            "Debit Card",
        ]

        travel_preferences = [
            "Adventure",
            "Cultural",
            "Relaxation",
            "Eco-Tourism",
            "Luxury",
        ]

        languages = [
            "English",
            "French",
            "Kinyarwanda",
        ]

        payment_statuses = [
            "PENDING",
            "COMPLETED",
            "FAILED",
            "REFUNDED",
        ]

        booking_statuses = [
            "PENDING",
            "CONFIRMED",
            "CANCELLED",
            "COMPLETED",
        ]

        mobile_providers = [
            "MTN Mobile Money",
            "Airtel Money",
        ]

        payout_statuses = [
            "PENDING",
            "PROCESSING",
            "PAID",
            "FAILED",
        ]

        for name in payment_methods:
            PaymentMethod.objects.get_or_create(name=name)

        for name in travel_preferences:
            TravelPreference.objects.get_or_create(name=name)

        for name in languages:
            Language.objects.get_or_create(name=name)

        for code in payment_statuses:
            PaymentStatus.objects.get_or_create(code=code)

        for code in booking_statuses:
            BookingStatus.objects.get_or_create(code=code)

        for name in mobile_providers:
            MobileProvider.objects.get_or_create(name=name)

        for code in payout_statuses:
            PayoutStatus.objects.get_or_create(code=code)

        self.stdout.write(self.style.SUCCESS("Reference data seeded successfully."))