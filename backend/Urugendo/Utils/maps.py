from django.conf import settings


def get_maps_config() -> dict:
    """
    Returns the Maps JS API config for the frontend.
    Served through a protected DRF endpoint — key never exposed in frontend source.

    Usage (in a view):
        from Utils.maps import get_maps_config
        return Response(get_maps_config())

    Frontend usage after fetching:
        const { api_key, libraries, version } = await fetch('/api/maps/config/').then(r => r.json())
        loader.load({ key: api_key, libraries, version })
    """
    return {
        "api_key": settings.GOOGLE_MAPS_API_KEY,
        "libraries": ["places", "marker"],
        "version": "weekly",
    }