from django.test import TestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class RegisterViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/users/auth/create/"
        self.valid_payload = {
            "username": "testuser",
            "email": "test@example.com",
            "password": "SecurePass123!",
            "confirm_password": "SecurePass123!",
            "first_name": "Test",
            "last_name": "User",
            "role": "Tourist",
        }

    @patch("Utils.email.send_verification_email")
    def test_register_success(self, mock_send_email):
        print("Testing user registration with payload:")
        response = self.client.post(self.url, self.valid_payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


    @patch("Utils.email.send_verification_email")
    def test_register_creates_inactive_user(self, mock_send_email):
        """Registered user should be inactive until email is verified."""
        print("Testing user registration creates inactive user with payload:")
        self.client.post(self.url, self.valid_payload, format="json")

        user = User.objects.get(email=self.valid_payload["email"])
        self.assertFalse(user.is_active)

    def test_register_missing_required_fields(self):
        """Missing required fields returns 400."""
        print("Testing user registration with missing fields")
        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("Utils.email.send_verification_email")
    def test_register_duplicate_email(self, mock_send_email):
        """Duplicate email returns 400."""
        print("Testing user registration with duplicate email")
        self.client.post(self.url, self.valid_payload, format="json")
        response = self.client.post(self.url, self.valid_payload, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginViewTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = "/users/auth/login/"
        self.password = "SecurePass123!"
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password=self.password,
            is_active=True,
        )

    @patch("Utils.jwt.get_tokens_for_user")
    def test_login_with_email_success(self, mock_tokens):
        """Login with email returns 200 with tokens and user data."""
        print("Testing login with email")
        mock_tokens.return_value = {"access": "access_token", "refresh": "refresh_token"}

        response = self.client.post(
            self.url,
            {"identifier": self.user.email, "password": self.password},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)
        self.assertIn("user", response.data)

    @patch("Utils.jwt.get_tokens_for_user")
    def test_login_with_username_success(self, mock_tokens):
        """Login with username returns 200 with tokens and user data."""
        print("Testing login with username")
        mock_tokens.return_value = {"access": "access_token", "refresh": "refresh_token"}

        response = self.client.post(
            self.url,
            {"identifier": self.user.username, "password": self.password},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("tokens", response.data)

    def test_login_wrong_password(self):
        """Wrong password returns 401."""
        print("Testing login with wrong password")
        response = self.client.post(
            self.url,
            {"identifier": self.user.email, "password": "WrongPassword!"},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Invalid credentials", response.data["error"])

    def test_login_nonexistent_user(self):
        """Non-existent user returns 401."""
        print("Testing login with non-existent user")
        response = self.client.post(
            self.url,
            {"identifier": "ghost@example.com", "password": self.password},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertIn("Invalid credentials", response.data["error"])

    def test_login_inactive_user(self):
        """Unverified (inactive) user returns 403."""
        print("Testing login with inactive user")
        self.user.is_active = False
        self.user.save()

        response = self.client.post(
            self.url,
            {"identifier": self.user.email, "password": self.password},
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertIn("not verified", response.data["error"])

    def test_login_missing_credentials(self):
        """Missing identifier and password returns 400."""
        print("Testing login with missing credentials")
        response = self.client.post(self.url, {}, format="json")

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("required", response.data["error"])

    @patch("Utils.jwt.get_tokens_for_user")
    def test_login_response_contains_expected_user_fields(self, mock_tokens):
        """Login response includes all expected user fields."""
        print("Testing login response contains expected user fields")
        mock_tokens.return_value = {"access": "tok", "refresh": "tok"}

        response = self.client.post(
            self.url,
            {"identifier": self.user.email, "password": self.password},
            format="json",
        )

        user_data = response.data["user"]
        for field in ["id", "username", "email", "first_name", "last_name", "role", "profile_picture"]:
            self.assertIn(field, user_data)
