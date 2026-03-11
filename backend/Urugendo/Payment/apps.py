from django.apps import AppConfig


class PaymentConfig(AppConfig):
    name = 'Payment'

    def ready(self):
        from scheduler import setup_schedules
        try:
            setup_schedules()
        except Exception:
            pass
