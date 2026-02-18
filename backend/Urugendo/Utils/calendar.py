from django.conf import settings
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError


CALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar.events"]


def _get_calendar_service(user):
    """
    Builds Calendar API service from the user's stored OAuth token.
    Automatically refreshes the access token if expired.
    """
    # Import here to avoid circular imports
    from Users.models import GoogleOAuthToken

    token_obj = GoogleOAuthToken.objects.get(user=user)
    creds = Credentials(
        token=token_obj.access_token,
        refresh_token=token_obj.refresh_token,
        token_uri="https://oauth2.googleapis.com/token",
        client_id=settings.GOOGLE_CALENDAR_CLIENT_ID,
        client_secret=settings.GOOGLE_CALENDAR_CLIENT_SECRET,
        scopes=CALENDAR_SCOPES,
    )

    if creds.expired and creds.refresh_token:
        creds.refresh(Request())
        token_obj.access_token = creds.token
        token_obj.save(update_fields=["access_token"])

    return build("calendar", "v3", credentials=creds)


def add_event(
    user,
    title: str,
    description: str,
    start_datetime: str,
    end_datetime: str,
    location: str = "",
    timezone: str = "Africa/Kigali",
) -> dict:
    """
    Add an event to the user's Google Calendar.

    Args:
        user: Django User instance (must have a GoogleOAuthToken)
        title: Event title
        description: Event description
        start_datetime: ISO 8601 string e.g. "2025-06-01T10:00:00"
        end_datetime:   ISO 8601 string e.g. "2025-06-01T12:00:00"
        location: Optional location string
        timezone: Defaults to "Africa/Kigali" for Urugendo

    Returns:
        {"event_id": str, "event_link": str}

    Usage:
        from Utils.calendar import add_event
        result = add_event(
            user=request.user,
            title="Kigali City Tour",
            description="Meet at Kigali Convention Centre.",
            start_datetime="2025-06-01T09:00:00",
            end_datetime="2025-06-01T12:00:00",
            location="Kigali Convention Centre, Rwanda",
        )
        # result = {"event_id": "abc123", "event_link": "https://calendar.google.com/..."}
    """
    event_body = {
        "summary": title,
        "description": description,
        "location": location,
        "start": {"dateTime": start_datetime, "timeZone": timezone},
        "end": {"dateTime": end_datetime, "timeZone": timezone},
    }

    try:
        service = _get_calendar_service(user)
        event = service.events().insert(calendarId="primary", body=event_body).execute()
        return {"event_id": event["id"], "event_link": event.get("htmlLink", "")}
    except HttpError as e:
        raise Exception(f"Google Calendar error: {e}")


def delete_event(user, event_id: str) -> None:
    """
    Delete an event from the user's Google Calendar.

    Usage:
        from Utils.calendar import delete_event
        delete_event(user=request.user, event_id="abc123")
    """
    try:
        service = _get_calendar_service(user)
        service.events().delete(calendarId="primary", eventId=event_id).execute()
    except HttpError as e:
        raise Exception(f"Google Calendar delete error: {e}")


def update_event(user, event_id: str, **kwargs) -> dict:
    """
    Update fields of an existing calendar event.

    Usage:
        from Utils.calendar import update_event
        update_event(user=request.user, event_id="abc123", title="Updated Tour Name")
    """
    try:
        service = _get_calendar_service(user)
        event = service.events().get(calendarId="primary", eventId=event_id).execute()

        if "title" in kwargs:
            event["summary"] = kwargs["title"]
        if "description" in kwargs:
            event["description"] = kwargs["description"]
        if "start_datetime" in kwargs:
            event["start"]["dateTime"] = kwargs["start_datetime"]
        if "end_datetime" in kwargs:
            event["end"]["dateTime"] = kwargs["end_datetime"]
        if "location" in kwargs:
            event["location"] = kwargs["location"]

        updated = service.events().update(calendarId="primary", eventId=event_id, body=event).execute()
        return {"event_id": updated["id"], "event_link": updated.get("htmlLink", "")}
    except HttpError as e:
        raise Exception(f"Google Calendar update error: {e}")