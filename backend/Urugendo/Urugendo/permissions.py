from rest_framework import permissions
from rest_framework.permissions import BasePermission

class IsTourist(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'tourist'

class IsGuide(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'guide'
    
    
class IsAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user.is_authenticated and request.user.role == 'admin'


class IsSuperAdmin(BasePermission):

    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'admin' and request.user.is_superuser