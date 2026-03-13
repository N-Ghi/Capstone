from django.test import TestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch
from rest_framework.test import APIClient
from rest_framework import status
from decimal import Decimal

User = get_user_model()


def make_user(username, email, password="SecurePass123!", is_active=True):
    return User.objects.create_user(
        username=username, email=email, password=password, is_active=is_active
    )


MOCK_GEOCODE_RESULT = {
    "place_name": "Kigali, Rwanda",
    "latitude": '-1.9441',
    "longitude": '30.0619',
    "place_id": "ChIJxyz123",
}


class GeocodeViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/locations/geocode/"
        self.user = make_user("testuser", "test@example.com")

    @patch("Location.views.geocode_place")
    def test_geocode_success(self, mock_geocode):
        """Valid place name returns geocoded result."""
        print("Testing geocode success case...")
        mock_geocode.return_value = MOCK_GEOCODE_RESULT
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url, {"place_name": "Kigali"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["place_name"], MOCK_GEOCODE_RESULT["place_name"])
        self.assertEqual(response.data["latitude"], MOCK_GEOCODE_RESULT["latitude"])
        mock_geocode.assert_called_once_with("Kigali")

    @patch("Location.views.geocode_place")
    def test_geocode_place_not_found(self, mock_geocode):
        """geocode_place raising ValueError returns 404."""
        print("Testing geocode place not found case...")
        mock_geocode.side_effect = ValueError("Place not found.")
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url, {"place_name": "Nowhere Land"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn("error", response.data)

    @patch("Location.views.geocode_place")
    def test_geocode_external_service_error(self, mock_geocode):
        """Unexpected geocode error returns 502."""
        print("Testing geocode external service error case...")
        mock_geocode.side_effect = Exception("Service unavailable.")
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url, {"place_name": "Kigali"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_502_BAD_GATEWAY)
        self.assertIn("error", response.data)

    def test_geocode_missing_place_name(self):
        """Missing place_name field returns 400."""
        print("Testing geocode missing place_name case...")
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_geocode_unauthenticated(self):
        """Unauthenticated request returns 401."""
        print("Testing geocode unauthenticated case...")
        response = self.client.post(self.url, {"place_name": "Kigali"}, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class LocationSaveViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/locations/save/"
        self.user = make_user("testuser", "test@example.com")

        self.valid_payload = {
            "place_name": "Kigali, Rwanda",
            "latitude": "-1.9441",
            "longitude": "30.0619",
            "place_id": "ChIJxyz123",
        }

    def test_save_location_creates_new_record(self):
        """New coordinates are saved and returns 201."""
        print("Testing save location creates new record case...")
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["place_name"], self.valid_payload["place_name"])
        self.assertEqual(Decimal(response.data["latitude"]), Decimal(self.valid_payload["latitude"]))

    def test_save_location_returns_existing_record(self):
        """Duplicate coordinates return the existing record with 200."""
        print("Testing save location returns existing record case...")
        self.client.force_authenticate(user=self.user)
        self.client.post(self.url, self.valid_payload, format="json")

        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["place_name"], self.valid_payload["place_name"])

    def test_save_location_only_one_db_record_for_duplicate(self):
        """Two requests with same coordinates produce only one DB record."""
        print("Testing save location only one DB record for duplicate case...")
        from Location.models import Location

        self.client.force_authenticate(user=self.user)
        self.client.post(self.url, self.valid_payload, format="json")
        self.client.post(self.url, self.valid_payload, format="json")

        count = Location.objects.filter(
            latitude=self.valid_payload["latitude"],
            longitude=self.valid_payload["longitude"],
        ).count()
        self.assertEqual(count, 1)

    def test_save_location_without_place_id(self):
        """place_id is optional; omitting it still creates the record."""
        print("Testing save location without place_id case...")
        self.client.force_authenticate(user=self.user)
        payload = {k: v for k, v in self.valid_payload.items() if k != "place_id"}

        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_save_location_missing_required_fields(self):
        """Missing latitude, longitude, or place_name returns 400."""
        print("Testing save location missing required fields case...")
        self.client.force_authenticate(user=self.user)

        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_save_location_unauthenticated(self):
        """Unauthenticated request returns 401."""
        print("Testing save location unauthenticated case...")
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
