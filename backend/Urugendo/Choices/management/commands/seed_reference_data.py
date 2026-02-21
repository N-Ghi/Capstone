from django.core.management.base import BaseCommand
from Choices.models import (
    PaymentMethod, TravelPreference, Language, PaymentStatus, MobileProvider, PayoutStatus,
)

class Command(BaseCommand):
    help = "Seed reference tables with initial data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding reference data...")

        # Define entries with optional 'code' for Language
        label_data = {
            PaymentMethod: ["Mobile Money", "Credit Card", "Debit Card"],
            TravelPreference: ["Adventure", "Cultural", "Relaxation", "Eco-Tourism", "Luxury"],
            Language: [
                {"name": "English", "code": "en"},
                {"name": "French", "code": "fr"},
                {"name": "Kinyarwanda", "code": "rw"},
            ],
            PaymentStatus: ["PENDING", "COMPLETED", "FAILED", "REFUNDED"],
            MobileProvider: ["MTN Mobile Money", "Airtel Money"],
            PayoutStatus: ["PENDING", "PROCESSING", "PAID", "FAILED"],
        }

        for model, entries in label_data.items():
            for entry in entries:
                if isinstance(entry, dict):
                    # For Language with name & code
                    obj, created = model.objects.get_or_create(**entry)
                else:
                    # For other models with only 'name' or 'code'
                    field_name = 'name' if hasattr(model, 'name') else 'code'
                    obj, created = model.objects.get_or_create(**{field_name: entry})

                if created:
                    self.stdout.write(f"Created {model.__name__}: {entry}")

        self.stdout.write(self.style.SUCCESS("Reference data seeded successfully."))
        