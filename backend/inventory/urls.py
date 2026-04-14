"""
URL Configuration untuk Inventory App
Smart-Inventory STTR API Endpoints
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    CustomTokenObtainPairView,
    LogoutView,
    UserViewSet,
    CategoryViewSet,
    RoomViewSet,
    AssetViewSet,
)

# Router untuk ViewSets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'rooms', RoomViewSet, basename='room')
router.register(r'assets', AssetViewSet, basename='asset')

# URL Patterns
urlpatterns = [
    # ========================================================================
    # AUTHENTICATION ENDPOINTS
    # ========================================================================
    path('auth/login', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/logout', LogoutView.as_view({'post': 'create'}), name='logout'),
    
    # ========================================================================
    # USER MANAGEMENT ENDPOINTS (ADMIN only)
    # ========================================================================
    # GET /api/v1/users - List users
    # POST /api/v1/users - Create user
    # GET /api/v1/users/{id} - Get user detail
    # PUT /api/v1/users/{id} - Update user
    # DELETE /api/v1/users/{id} - Delete user
    
    # ========================================================================
    # ROUTER ENDPOINTS
    # ========================================================================
    path('', include(router.urls)),
    
    # ========================================================================
    # DASHBOARD ENDPOINTS
    # ========================================================================
    # TODO: Akan ditambahkan di Task 15
    # GET /api/v1/dashboard/summary
    
    # ========================================================================
    # ASSET ENDPOINTS
    # ========================================================================
    # GET /api/v1/categories - List categories
    # POST /api/v1/categories - Create category
    # GET /api/v1/categories/{id} - Get category detail
    # PUT /api/v1/categories/{id} - Update category
    # DELETE /api/v1/categories/{id} - Delete category
    
    # GET /api/v1/rooms - List rooms
    # POST /api/v1/rooms - Create room
    # GET /api/v1/rooms/{id} - Get room detail
    # PUT /api/v1/rooms/{id} - Update room
    # DELETE /api/v1/rooms/{id} - Delete room
    
    # GET /api/v1/assets - List assets (dengan filter & search)
    # POST /api/v1/assets - Create asset
    # GET /api/v1/assets/{id} - Get asset detail
    # PUT /api/v1/assets/{id} - Update asset
    # DELETE /api/v1/assets/{id} - Delete asset
    
    # ========================================================================
    # LOAN ENDPOINTS
    # ========================================================================
    # TODO: Akan ditambahkan di Task 5, 6
    # POST /api/v1/loans/request
    # GET /api/v1/loans/approval-queue
    # POST /api/v1/loans/{id}/approve
    # POST /api/v1/loans/{id}/reject
    
    # ========================================================================
    # RETURN ENDPOINTS
    # ========================================================================
    # TODO: Akan ditambahkan di Task 8
    # GET /api/v1/returns/search
    # POST /api/v1/returns/process
    
    # ========================================================================
    # DAMAGE REPORT ENDPOINTS
    # ========================================================================
    # TODO: Akan ditambahkan di Task 11
    # POST /api/v1/damage-reports
    # GET /api/v1/damage-reports
    
    # ========================================================================
    # MAINTENANCE ENDPOINTS
    # ========================================================================
    # TODO: Akan ditambahkan di Task 11, 12
    # GET /api/v1/maintenance/tasks
    # POST /api/v1/maintenance/tasks/{id}/start
    # POST /api/v1/maintenance/tasks/{id}/complete
    
    # ========================================================================
    # AUDIT LOG ENDPOINTS
    # ========================================================================
    # TODO: Akan ditambahkan di Task 15
    # GET /api/v1/audit-logs
]
