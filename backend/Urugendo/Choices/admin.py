from django.contrib import admin
from .models import PaymentMethod, TravelPreference, Language, PaymentStatus, MobileProvider

admin.site.register(PaymentMethod)
admin.site.register(TravelPreference)
admin.site.register(Language)
admin.site.register(PaymentStatus)
admin.site.register(MobileProvider)