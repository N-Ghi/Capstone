import uuid
from django.db import models

class SystemInfo(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    key = models.CharField(max_length=255, unique=True)
    value = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.key}: {self.value[:50]}..." if self.value else f"{self.key}: (empty)"
    