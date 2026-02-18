from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status

from Utils.geocoding import geocode_place, reverse_geocode
from .models import Location
from .serializers import GeocodeRequestSerializer, LocationSaveSerializer, LocationSerializer


class GeocodeView(APIView):
    """
    Frontend calls this while the user types a location.
    Returns lat/lng + formatted address.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = GeocodeRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            result = geocode_place(serializer.validated_data["place_name"])
            return Response(result)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

class LocationSaveView(APIView):
    """
    Called when the user confirms and saves a location.
    Saves coordinates to DB. Returns existing record if coordinates already saved.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = LocationSaveSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        location, created = Location.objects.get_or_create(
            latitude=data["latitude"],
            longitude=data["longitude"],
            defaults={
                "place_name": data["place_name"],
                "place_id": data.get("place_id", ""),
            },
        )
        return Response(
            LocationSerializer(location).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )

class ReverseGeocodeView(APIView):
    """
    Convert coordinates to a place name.
    Useful when a Guide drops a pin on the map instead of typing.

    POST /api/locations/reverse-geocode/
    Body: { "latitude": -1.9536, "longitude": 30.0928 }
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        lat = request.data.get("latitude")
        lng = request.data.get("longitude")

        if lat is None or lng is None:
            return Response(
                {"error": "'latitude' and 'longitude' are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            result = reverse_geocode(float(lat), float(lng))
            return Response({**result, "latitude": lat, "longitude": lng})
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)
