"""
Custom Permission Classes untuk Role-Based Access Control (RBAC)
Smart-Inventory STTR
"""

from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    """
    Permission class untuk ADMIN role
    ADMIN memiliki full access ke semua fitur
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'ADMIN'
        )


class IsStaffOrAdmin(BasePermission):
    """
    Permission class untuk STAFF atau ADMIN role
    STAFF dapat manage peminjaman, pengembalian, approval
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role in ['ADMIN', 'STAFF']
        )


class IsTechnician(BasePermission):
    """
    Permission class untuk TEKNISI, STAFF, atau ADMIN role
    TEKNISI dapat manage maintenance tasks, repair budget
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role in ['ADMIN', 'STAFF', 'TEKNISI']
        )


class IsUKM(BasePermission):
    """
    Permission class untuk UKM role
    UKM dapat create loan request dan view own loans
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role == 'UKM'
        )


class IsUKMOrStaffOrAdmin(BasePermission):
    """
    Permission class untuk UKM, STAFF, atau ADMIN role
    """
    
    def has_permission(self, request, view):
        return (
            request.user and
            request.user.is_authenticated and
            request.user.role in ['ADMIN', 'STAFF', 'UKM']
        )


class IsOwnerOrStaffOrAdmin(BasePermission):
    """
    Permission class untuk object-level permission
    User hanya bisa akses data miliknya sendiri, kecuali STAFF/ADMIN
    """
    
    def has_object_permission(self, request, view, obj):
        # ADMIN dan STAFF bisa akses semua
        if request.user.role in ['ADMIN', 'STAFF']:
            return True
        
        # UKM hanya bisa akses data miliknya sendiri
        if hasattr(obj, 'ukm_account'):
            return obj.ukm_account == request.user
        
        # Default: tidak ada akses
        return False
