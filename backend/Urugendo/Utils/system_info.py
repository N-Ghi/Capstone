from System.models import SystemInfo

def get_system_setting(key, default=None):
    try:
        return SystemInfo.objects.get(key=key).value
    except SystemInfo.DoesNotExist:
        return default