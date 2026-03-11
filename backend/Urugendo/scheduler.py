from django_q.models import Schedule
from django_q.tasks import schedule


def setup_schedules():
    """
    Idempotently register all recurring tasks.
    Call this from AppConfig.ready() — safe to call multiple times.
    """
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
            'minutes': 60,
        },
        {
            'name': 'Create payouts for completed bookings',
            'func': 'Payment.tasks.create_payouts_for_completed_bookings',
            'minutes': 10,
        },
        {
            'name': 'Process pending payouts',
            'func': 'Payment.tasks.process_pending_payouts',
            'minutes': 15,
        },
    ]

    for task in tasks:
        Schedule.objects.get_or_create(
            name=task['name'],
            defaults={
                'func': task['func'],
                'schedule_type': Schedule.MINUTES,
                'minutes': task['minutes'],
                'repeats': -1,  # run forever
            }
        )
