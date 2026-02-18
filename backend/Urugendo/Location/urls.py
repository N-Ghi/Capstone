from django.urls import path
from .views import GeocodeView, LocationSaveView, ReverseGeocodeView

urlpatterns = [
    path("geocode/", GeocodeView.as_view()),
    path("save/", LocationSaveView.as_view()),
    path("reverse-geocode/", ReverseGeocodeView.as_view()),
    ]