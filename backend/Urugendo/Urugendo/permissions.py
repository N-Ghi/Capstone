from rest_framework import permissions
from rest_framework.permissions import BasePermission


class IsTourist(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Tourist'


class IsGuide(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Guide'


class IsAdmin(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Admin'


class IsSuperAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == 'Admin' and request.user.is_superuser


class IsGuideOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.user.role == 'Admin':
            return True
        if request.user.role == 'Guide' and obj.guide == request.user:
            return True
        return False