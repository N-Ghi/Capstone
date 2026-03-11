from django.apps import AppConfig


class BookingsConfig(AppConfig):
    name = 'Booking'

    def ready(self):
        import Booking.signals