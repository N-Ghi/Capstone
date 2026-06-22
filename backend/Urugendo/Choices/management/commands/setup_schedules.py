# Booking/management/commands/setup_schedules.py

from django.core.management.base import BaseCommand
from django_q.models import Schedule

class Command(BaseCommand):
    help = "Set up recurring django-q schedules"

    def handle(self, *args, **kwargs):
        tasks = [
            {
                'name': 'Expire pending bookings',
                'func': 'Booking.tasks.expire_pending_bookings',
                'minutes': 5,
            },
            {
                'name': 'Complete confirmed bookings',
                'func': 'Booking.tasks.complete_confirmed_bookings',
                'minutes': 5,
            },
            {
                'name': 'Deactivate past slots',
                'func': 'Booking.tasks.deactivate_past_slots',
                'minutes': 5,
            },
            {
                'name': 'Create payouts for completed bookings',
                'func': 'Payment.tasks.create_payouts_for_completed_bookings',
                'minutes': 5,
            },
            {
                'name': 'Process pending payouts',
                'func': 'Payment.tasks.process_pending_payouts',
                'minutes': 5,
            },
            {
                'name': 'Retry failed payouts',
                'func': 'Payment.tasks.retry_failed_payouts',
                'minutes': 7,
            },
        ]

        for task in tasks:
            Schedule.objects.get_or_create(
                name=task['name'],
                defaults={
                    'func': task['func'],
                    'schedule_type': Schedule.MINUTES,
                    'minutes': task['minutes'],
                    'repeats': -1,
                }
            )

        self.stdout.write(self.style.SUCCESS("Schedules set up successfully"))