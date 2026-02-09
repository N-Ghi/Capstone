from datetime import timedelta
from rest_framework_simplejwt.tokens import RefreshToken

def get_tokens_for_user(user):
    """
    Returns a dict containing access and refresh tokens for the given user.
    """
    refresh = RefreshToken.for_user(user)
    # Add custom claims
    refresh['role'] = user.role
    refresh['email'] = user.email

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }