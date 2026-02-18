# def send_verification_email(email, verification_link):
#     """
#     Mock email sender. To be replaced with Google API later.
#     """
#     print("===================================")
#     print(f"Sending verification email to: {email}")
#     print(f"Verification link: {verification_link}")
#     print("===================================")

import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from django.conf import settings
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


def _get_gmail_service():
    creds = Credentials(
        token=None,
        refresh_token=settings.GOOGLE_REFRESH_TOKEN,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CLIENT_ID,
        client_secret=settings.GOOGLE_CLIENT_SECRET,
        scopes=["https://www.googleapis.com/auth/gmail.send"],
    )
    return build("gmail", "v1", credentials=creds)


def send_email(to, subject, html_body):
    """
    Usage:
        from Utils.email import send_email
        send_email("user@example.com", "Subject", "<p>Body</p>")
    """
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = settings.GMAIL_SENDER_EMAIL
    message["To"] = to
    message.attach(MIMEText(html_body, "html"))
    raw = base64.urlsafe_b64encode(message.as_bytes()).decode()

    try:
        service = _get_gmail_service()
        service.users().messages().send(userId="me", body={"raw": raw}).execute()
    except HttpError as e:
        raise Exception(f"Gmail API error: {e}")

# --- Named templates for tasks ---

def send_verification_email(to, verify_url):
    """
    Send verification email to new users.
    """
    send_email(
        to=to,
        subject="Verify your Urugendo account",
        html_body=f"""
            <h2>Welcome to Urugendo!</h2>
            <p>Please verify your email address by clicking the link below:</p>
            <a href="{verify_url}" style="padding:10px 20px;background:#4CAF50;color:white;text-decoration:none;border-radius:5px;">
                Verify Email
            </a>
            <p>This link expires in 1 hour.</p>
            <p> If the button doesn't work, copy and paste the following URL into your browser:</p>
            <p>{verify_url}</p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
        """,
    )

def send_booking_confirmation(to, tourist_name, experience_title, booking_date, start_time, end_time):
    """
    Send booking confirmation email to tourists.
    """
    send_email(
        to=to,
        subject=f"Booking Confirmed: {experience_title}",
        html_body=f"""
            <h2>Your booking is confirmed, {tourist_name}!</h2>
            <p>Experience: <strong>{experience_title}</strong></p>
            <p>Date: <strong>{booking_date}</strong></p>
            <p>Time: <strong>{start_time} - {end_time}</strong></p>
            <p>We look forward to seeing you!</p>
        """,
    )

def send_booking_cancellation(to, tourist_name, experience_title, booking_date):
    """
    Send booking cancellation email to tourists.
    """
    send_email(
        to=to,
        subject=f"Booking Cancelled: {experience_title}",
        html_body=f"""
            <h2>Your booking has been cancelled, {tourist_name}.</h2>
            <p>Experience: <strong>{experience_title}</strong></p>
            <p>Date: <strong>{booking_date}</strong></p>
            <p>If this was a mistake, please try booking again.</p>
        """,
    )

def send_cancellation_alert(to, guide_name, tourist_name, experience_title, booking_date):
    """
    Notify guides when a tourist cancels their booking.
    """
    send_email(
        to=to,
        subject=f"Booking Cancelled: {experience_title}",
        html_body=f"""
            <h2>Hi {guide_name}, a booking has been cancelled.</h2>
            <p>Tourist: <strong>{tourist_name}</strong></p>
            <p>Experience: <strong>{experience_title}</strong></p>
            <p>Date: <strong>{booking_date}</strong></p>
        """,
    )

def send_reminder_email(to, name, experience_title, event_time):
    """
    Send reminder email to tourists.
    """
    send_email(
        to=to,
        subject=f"Reminder: {experience_title} is coming up!",
        html_body=f"""
            <h2>Hey {name}, don't forget!</h2>
            <p>Your experience <strong>{experience_title}</strong> is scheduled for:</p>
            <p><strong>{event_time}</strong></p>
        """,
    )

def send_guide_new_booking_alert(to, guide_name, tourist_name, experience_title, booking_date):
    """
    Notify guides when a tourist books their experience.
    """
    send_email(
        to=to,
        subject=f"New Booking: {experience_title}",
        html_body=f"""
            <h2>Hi {guide_name}, you have a new booking!</h2>
            <p>Tourist: <strong>{tourist_name}</strong></p>
            <p>Experience: <strong>{experience_title}</strong></p>
            <p>Date: <strong>{booking_date}</strong></p>
        """,
    )