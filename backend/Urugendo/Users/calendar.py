import os
from google_auth_oauthlib.flow import Flow
from django.conf import settings
from django.shortcuts import redirect
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import get_user_model

from .models import GoogleOAuthToken

# Disable HTTPS requirement for local development
if settings.DEBUG:
    os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

User = get_user_model()
CALENDAR_SCOPES = ["https://www.googleapis.com/auth/calendar.events"]


def _get_calendar_flow():
    return Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CALENDAR_CLIENT_ID,
                "client_secret": settings.GOOGLE_CALENDAR_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GOOGLE_CALENDAR_REDIRECT_URI],
            }
        },
        scopes=CALENDAR_SCOPES,
    )

class CalendarAuthorizeView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        user_id = request.GET.get('user_id')
        
        if not user_id:
            return Response(
                {"error": "user_id is required in query parameter"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Invalid user_id"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        request.session['calendar_user_id'] = str(user.id)
        request.session.save()
        
        flow = _get_calendar_flow()
        flow.redirect_uri = settings.GOOGLE_CALENDAR_REDIRECT_URI
        
        auth_url, state = flow.authorization_url(
            access_type="offline",
            include_granted_scopes="false",
            prompt="consent",
        )
        
        request.session["google_oauth_state"] = state
        request.session.save()
        
        return redirect(auth_url)

class CalendarCallbackView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        # Retrieve user ID from session
        user_id = request.session.get('calendar_user_id')
        
        if not user_id:
            return Response(
                {"error": "Session expired. Please try connecting again."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        
        flow = _get_calendar_flow()
        flow.redirect_uri = settings.GOOGLE_CALENDAR_REDIRECT_URI
        
        try:
            flow.fetch_token(authorization_response=request.build_absolute_uri())
        except Exception as e:
            return Response(
                {"error": f"Failed to fetch token: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        creds = flow.credentials
        
        GoogleOAuthToken.objects.update_or_create(
            user=user,
            defaults={
                "access_token": creds.token,
                "refresh_token": creds.refresh_token,
            },
        )
        
        request.session.pop('calendar_user_id', None)
        request.session.pop('google_oauth_state', None)
        
        frontend_url = settings.FRONTEND_URL or 'http://localhost:5173'
        return redirect(f'{frontend_url}/{user.role.lower()}/profile/{user_id}?calendar_connected=true')

class CalendarDisconnectView(APIView):
    permission_classes = [AllowAny]
    
    def delete(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            request.user.google_token.delete()
            return Response({"message": "Calendar disconnected successfully."})
        except GoogleOAuthToken.DoesNotExist:
            return Response(
                {"error": "Calendar not connected."},
                status=status.HTTP_400_BAD_REQUEST
            )

class CalendarStatusView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        if not request.user.is_authenticated:
            return Response(
                {"error": "Authentication required."},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        is_connected = hasattr(request.user, 'google_token')
        return Response({
            "connected": is_connected,
            "connected_at": request.user.google_token.created_at if is_connected else None
        })