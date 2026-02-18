import requests
from django.conf import settings


def geocode_place(place_name):
    """
    Convert a place name to lat/lng coordinates using Google Geocoding API.
    """
    try:
        response = requests.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={
                "address": place_name,
                "key": settings.GOOGLE_MAPS_API_KEY,
                "region": "rw",        # prioritises results from Rwanda
                "language": "en",
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()

        if data["status"] == "ZERO_RESULTS":
            raise ValueError(f"No results found for: '{place_name}'")

        if data["status"] != "OK":
            raise Exception(f"Geocoding API error: {data['status']} — {data.get('error_message', '')}")

        result = data["results"][0]
        location = result["geometry"]["location"]

        return {
            "place_name": result["formatted_address"],
            "latitude": location["lat"],
            "longitude": location["lng"],
            "place_id": result.get("place_id", ""),
        }

    except requests.RequestException as e:
        raise Exception(f"Geocoding request failed: {e}")

def reverse_geocode(latitude, longitude):
    """
    Convert lat/lng coordinates back to a human-readable address.
    """
    try:
        response = requests.get(
            "https://maps.googleapis.com/maps/api/geocode/json",
            params={
                "latlng": f"{latitude},{longitude}",
                "key": settings.GOOGLE_MAPS_API_KEY,
                "language": "en",
            },
            timeout=10,
        )
        response.raise_for_status()
        data = response.json()

        if data["status"] == "ZERO_RESULTS":
            raise ValueError(f"No address found for: ({latitude}, {longitude})")

        if data["status"] != "OK":
            raise Exception(f"Reverse geocoding error: {data['status']}")

        result = data["results"][0]
        return {
            "place_name": result["formatted_address"],
            "place_id": result.get("place_id", ""),
        }

    except requests.RequestException as e:
        raise Exception(f"Reverse geocoding request failed: {e}")
