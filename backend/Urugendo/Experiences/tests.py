from django.test import TestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch, MagicMock
from rest_framework.test import APIClient
from rest_framework import status

from datetime import datetime
User = get_user_model()


def make_user(username, email, password="SecurePass123!", role="Tourist", is_active=True):
    return User.objects.create_user(
        username=username, email=email, password=password, role=role, is_active=is_active
    )


class ExperienceCreateTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/experiences/"

        self.guide = make_user("guide1", "guide@example.com", role="Guide")
        self.admin = make_user("admin1", "admin@example.com", role="Admin")
        self.tourist = make_user("tourist1", "tourist@example.com", role="Tourist")

        self.valid_payload = {
            "title": "Kigali City Walk",
            "description": "A walking tour of Kigali.",
            "price": "50.00",
            # Add other required fields based on your ExperienceSerializer
        }

    def test_guide_can_create_experience(self):
        """A Guide can create an experience; it is assigned to them."""
        print("Testing guide create experience")
        self.client.force_authenticate(user=self.guide)
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admin_can_create_experience_for_guide(self):
        """An Admin can create an experience and assign it to a guide via guide_id."""
        print("Testing admin create experience for guide")
        self.client.force_authenticate(user=self.admin)
        payload = {**self.valid_payload, "guide_id": self.guide.id}
        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_admin_create_without_guide_id_fails(self):
        """Admin creating an experience without guide_id returns 400."""
        print("Testing admin create experience without guide_id")
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_admin_create_with_invalid_guide_id_fails(self):
        """Admin providing a non-existent guide_id returns 404."""
        print("Testing admin create experience with invalid guide_id")
        self.client.force_authenticate(user=self.admin)
        payload = {**self.valid_payload, "guide_id": 99999}
        response = self.client.post(self.url, payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_tourist_cannot_create_experience(self):
        """A Tourist is forbidden from creating experiences."""
        print("Testing tourist cannot create experience")
        self.client.force_authenticate(user=self.tourist)
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_create_experience(self):
        """Unauthenticated request returns 401."""
        print("Testing unauthenticated cannot create experience")
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_destroy_sets_is_active_false(self):
        """Deleting an experience soft-deletes it (is_active=False)."""
        print("Testing experience soft delete")
        self.client.force_authenticate(user=self.guide)
        create_response = self.client.post(self.url, self.valid_payload, format="json")
        exp_id = create_response.data["id"]

        delete_response = self.client.delete(f"{self.url}{exp_id}/")

        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)

        from Experiences.models import Experience
        exp = Experience.objects.get(pk=exp_id)
        self.assertFalse(exp.is_active)

class ExperienceSlotCreateTests(TestCase):
    def setUp(self):
        self.client = APIClient()

        self.guide = make_user("guide1", "guide@example.com", role="Guide")
        self.other_guide = make_user("guide2", "guide2@example.com", role="Guide")
        self.admin = make_user("admin1", "admin@example.com", role="Admin")
        self.tourist = make_user("tourist1", "tourist@example.com", role="Tourist")

        # Create a base experience owned by guide
        from Experiences.models import Experience
        self.experience = Experience.objects.create(
            title="Kigali City Walk",
            description="A walking tour.",
            guide=self.guide,
            is_active=True,
        )

        self.url = f"/experiences/{self.experience.pk}/slots/"

        self.valid_slot = {
            "date": "2026-06-01",
            "start_time": "09:00:00",
            "end_time": "12:00:00",
            "capacity": 10,
            "remaining_slots": 10,
            "price": "25.00",
        }

    @patch("Experiences.views.add_event")
    def test_guide_owner_can_create_slot(self, mock_add_event):
        print("Testing guide owner can create slot")
        self.client.force_authenticate(user=self.guide)
        response = self.client.post(self.url, self.valid_slot, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch("Experiences.views.add_event")
    def test_admin_can_create_slot(self, mock_add_event):
        """An admin can create a slot for any experience."""
        print("Testing admin can create slot for any experience")
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, self.valid_slot, format="json")

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_other_guide_cannot_create_slot(self):
        """A guide who does not own the experience is forbidden."""
        print("Testing other guide cannot create slot")
        self.client.force_authenticate(user=self.other_guide)
        response = self.client.post(self.url, self.valid_slot, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("own experiences", response.data["detail"])

    def test_tourist_cannot_create_slot(self):
        """A tourist is forbidden from creating slots."""
        print("Testing tourist cannot create slot")
        self.client.force_authenticate(user=self.tourist)
        response = self.client.post(self.url, self.valid_slot, format="json")

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_cannot_create_slot(self):
        """Unauthenticated request returns 401."""
        print("Testing unauthenticated cannot create slot")
        response = self.client.post(self.url, self.valid_slot, format="json")

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_slot_on_nonexistent_experience_returns_404(self):
        """Creating a slot for a non-existent experience returns 404."""
        print("Testing slot creation on non-existent experience returns 404")
        self.client.force_authenticate(user=self.guide)
        url = "/experiences/99999/slots/"
        response = self.client.post(url, self.valid_slot, format="json")

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    @patch("Experiences.views.add_event")
    def test_slot_missing_required_fields(self, mock_add_event):
        """Missing required slot fields returns 400."""
        print("Testing slot creation with missing required fields returns 400")
        self.client.force_authenticate(user=self.guide)
        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("Experiences.views.add_event")
    def test_calendar_event_called_when_guide_has_google_token(self, mock_add_event):
        """add_event is called when the guide has a google_token."""
        print("Testing calendar event creation when guide has google token")
        from Users.models import GoogleOAuthToken
        GoogleOAuthToken.objects.create(
            user=self.guide,
            access_token="fake_access",
            refresh_token="fake_refresh",
            created_at = datetime.now(),
            updated_at = datetime.now(),
        )

        self.client.force_authenticate(user=self.guide)
        self.client.post(self.url, self.valid_slot, format="json")

        mock_add_event.assert_called_once()

    @patch("Experiences.views.add_event")
    def test_calendar_event_not_called_without_google_token(self, mock_add_event):
        """add_event is NOT called when the guide has no google_token."""
        print("Testing calendar event not created when guide has no google token")
        self.client.force_authenticate(user=self.guide)
        self.client.post(self.url, self.valid_slot, format="json")

        mock_add_event.assert_not_called()
