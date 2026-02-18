import uuid
from django.db import models

class Location(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    latitude = models.DecimalField(max_digits=15, decimal_places=10)
    longitude = models.DecimalField(max_digits=15, decimal_places=10)
    place_name = models.CharField(max_length=255)
    place_id = models.CharField(max_length=255, blank=True)

    def google_maps_url(self):
        return f"https://www.google.com/maps?q={self.latitude},{self.longitude}"

    def __str__(self):
        return f"{self.place_name} ({self.latitude}, {self.longitude})"