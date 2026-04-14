"""
Views untuk Smart-Inventory STTR
Django REST Framework Views & ViewSets
"""

from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from django_filters.rest_framework import DjangoFilterBackend

from .models import Category, Room, Asset
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserSerializer,
    UserCreateSerializer,
    CategorySerializer,
    RoomSerializer,
    AssetSerializer,
    AssetListSerializer,
)
from .permissions import IsAdmin, IsStaffOrAdmin

User = get_user_model()


# ============================================================================
# AUTHENTICATION VIEWS
# ============================================================================

class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view yang menggunakan CustomTokenObtainPairSerializer
    
    POST /api/v1/auth/login
    Request Body:
    {
        "username": "admin_user",
        "password": "password123"
    }
    
    Response:
    {
        "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "user": {
            "id": 1,
            "username": "admin_user",
            "email": "admin@sttr.ac.id",
            "first_name": "Admin",
            "last_name": "User",
            "role": "ADMIN",
            "phone_number": "081234567890"
        }
    }
    """
    serializer_class = CustomTokenObtainPairSerializer
    permission_classes = [AllowAny]


class LogoutView(viewsets.ViewSet):
    """
    Logout view yang menambahkan refresh token ke blacklist
    
    POST /api/v1/auth/logout
    Request Body:
    {
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
    
    Response:
    {
        "detail": "Logout berhasil"
    }
    """
    permission_classes = [IsAuthenticated]
    
    def create(self, request):
        try:
            refresh_token = request.data.get('refresh')
            if not refresh_token:
                return Response(
                    {'error': 'MISSING_REFRESH_TOKEN', 'message': 'Refresh token wajib diisi'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {'detail': 'Logout berhasil'},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'error': 'INVALID_TOKEN', 'message': 'Token tidak valid'},
                status=status.HTTP_400_BAD_REQUEST
            )


# ============================================================================
# USER MANAGEMENT VIEWS
# ============================================================================

class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet untuk manajemen user (ADMIN only)
    
    Endpoints:
    - GET /api/v1/users - List users dengan filter role
    - POST /api/v1/users - Create user baru
    - GET /api/v1/users/{id} - Get user detail
    - PUT /api/v1/users/{id} - Update user
    - DELETE /api/v1/users/{id} - Delete user
    """
    queryset = User.objects.all()
    permission_classes = [IsAdmin]
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        return UserSerializer
    
    def get_queryset(self):
        """
        Filter users berdasarkan role jika ada query parameter
        GET /api/v1/users?role=UKM
        """
        queryset = User.objects.all()
        role = self.request.query_params.get('role', None)
        
        if role:
            queryset = queryset.filter(role=role)
        
        return queryset.order_by('-created_at')
    
    def create(self, request, *args, **kwargs):
        """
        Create user baru dengan auto-generated password
        Return credentials (username & password) di response
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Return user data dengan credentials
        response_data = UserSerializer(user).data
        response_data['credentials'] = {
            'username': user.username,
            'password': user.plain_password  # Plain password hanya muncul sekali saat create
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)


# ============================================================================
# DASHBOARD VIEWS
# ============================================================================

# TODO: Akan diimplementasikan di Task 15


# ============================================================================
# ASSET VIEWS
# ============================================================================

class CategoryViewSet(viewsets.ModelViewSet):
    """
    ViewSet untuk manajemen kategori aset
    
    Endpoints:
    - GET /api/v1/categories - List categories
    - POST /api/v1/categories - Create category (ADMIN/STAFF)
    - GET /api/v1/categories/{id} - Get category detail
    - PUT /api/v1/categories/{id} - Update category (ADMIN/STAFF)
    - DELETE /api/v1/categories/{id} - Delete category (ADMIN)
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    
    def get_permissions(self):
        """
        ADMIN/STAFF bisa create/update
        ADMIN bisa delete
        Semua authenticated user bisa read
        """
        if self.action in ['create', 'update', 'partial_update']:
            return [IsStaffOrAdmin()]
        elif self.action == 'destroy':
            return [IsAdmin()]
        return [IsAuthenticated()]


class RoomViewSet(viewsets.ModelViewSet):
    """
    ViewSet untuk manajemen ruangan
    
    Endpoints:
    - GET /api/v1/rooms - List rooms
    - POST /api/v1/rooms - Create room (ADMIN/STAFF)
    - GET /api/v1/rooms/{id} - Get room detail
    - PUT /api/v1/rooms/{id} - Update room (ADMIN/STAFF)
    - DELETE /api/v1/rooms/{id} - Delete room (ADMIN)
    """
    queryset = Room.objects.all()
    serializer_class = RoomSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'name', 'building']
    ordering_fields = ['code', 'building', 'created_at']
    ordering = ['building', 'code']
    
    def get_queryset(self):
        """
        Filter rooms berdasarkan building jika ada query parameter
        GET /api/v1/rooms?building=Gedung A
        """
        queryset = Room.objects.all()
        building = self.request.query_params.get('building', None)
        
        if building:
            queryset = queryset.filter(building__icontains=building)
        
        return queryset
    
    def get_permissions(self):
        """
        ADMIN/STAFF bisa create/update
        ADMIN bisa delete
        Semua authenticated user bisa read
        """
        if self.action in ['create', 'update', 'partial_update']:
            return [IsStaffOrAdmin()]
        elif self.action == 'destroy':
            return [IsAdmin()]
        return [IsAuthenticated()]


class AssetViewSet(viewsets.ModelViewSet):
    """
    ViewSet untuk manajemen aset
    
    Endpoints:
    - GET /api/v1/assets - List assets dengan filter & search
    - POST /api/v1/assets - Create asset (ADMIN/STAFF)
    - GET /api/v1/assets/{id} - Get asset detail
    - PUT /api/v1/assets/{id} - Update asset (ADMIN/STAFF)
    - DELETE /api/v1/assets/{id} - Delete asset (ADMIN)
    
    Query Parameters:
    - category: Filter by category ID
    - status: Filter by status (TERSEDIA, DIPINJAM, PERBAIKAN, RUSAK)
    - is_space: Filter by is_space (true/false)
    - search: Search by code, name, description
    """
    queryset = Asset.objects.select_related('category', 'room').all()
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['code', 'name', 'description']
    ordering_fields = ['code', 'name', 'status', 'created_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """
        Use simplified serializer for list action
        """
        if self.action == 'list':
            return AssetListSerializer
        return AssetSerializer
    
    def get_queryset(self):
        """
        Filter assets berdasarkan query parameters
        GET /api/v1/assets?category=1&status=TERSEDIA&is_space=false
        """
        queryset = Asset.objects.select_related('category', 'room').all()
        
        # Filter by category
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category_id=category)
        
        # Filter by status
        status_param = self.request.query_params.get('status', None)
        if status_param:
            queryset = queryset.filter(status=status_param)
        
        # Filter by is_space
        is_space = self.request.query_params.get('is_space', None)
        if is_space is not None:
            is_space_bool = is_space.lower() == 'true'
            queryset = queryset.filter(is_space=is_space_bool)
        
        return queryset
    
    def get_permissions(self):
        """
        ADMIN/STAFF bisa create/update
        ADMIN bisa delete
        Semua authenticated user bisa read
        """
        if self.action in ['create', 'update', 'partial_update']:
            return [IsStaffOrAdmin()]
        elif self.action == 'destroy':
            return [IsAdmin()]
        return [IsAuthenticated()]


# ============================================================================
# LOAN VIEWS
# ============================================================================

# TODO: Akan diimplementasikan di Task 5, 6


# ============================================================================
# RETURN VIEWS
# ============================================================================

# TODO: Akan diimplementasikan di Task 8


# ============================================================================
# MAINTENANCE VIEWS
# ============================================================================

# TODO: Akan diimplementasikan di Task 11, 12
