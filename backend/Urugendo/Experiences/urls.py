from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ExperienceViewSet, ExperienceSlotViewSet

router = DefaultRouter()
router.register(r'', ExperienceViewSet, basename='experience')

urlpatterns = [
    # Experience CRUD
    path('', include(router.urls)),

    # Nested slot routes: /experiences/<exp_id>/slots/ and /experiences/<exp_id>/slots/<pk>/
    path( '<uuid:exp_id>/slots/', ExperienceSlotViewSet.as_view({ 'get': 'list',
        'post': 'create', }), name='experience-slot-list'
    ),
    path( '<uuid:exp_id>/slots/<uuid:pk>/', ExperienceSlotViewSet.as_view({
            'get': 'retrieve', 'put': 'update', 'patch': 'partial_update',
            'delete': 'destroy', }), name='experience-slot-detail'
    ),
]