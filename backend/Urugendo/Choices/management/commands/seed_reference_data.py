from django.core.management.base import BaseCommand
from Choices.models import ( PaymentMethod, TravelPreference, Language, PaymentStatus, MobileProvider, PayoutStatus,
)

class Command(BaseCommand):
    help = "Seed reference tables with initial data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding reference data...")

        label_data = {
            PaymentMethod: ["Mobile Money", "Credit Card", "Debit Card"],
            TravelPreference: ["Adventure", "Cultural", "Relaxation", "Eco-Tourism", "Luxury"],
            Language: ["English", "French", "Kinyarwanda"],
            PaymentStatus: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
            MobileProvider: ["MTN Mobile Money", "Airtel Money"],
            PayoutStatus: ["PENDING", "PROCESSING", "PAID", "FAILED"],
        }

        for model, entries in label_data.items():
            for entry in entries:
                field_name = 'name' if hasattr(model, 'name') else 'code'
                model.objects.get_or_create(**{field_name: entry})

        self.stdout.write(self.style.SUCCESS("Reference data seeded successfully."))