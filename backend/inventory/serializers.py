"""
Serializers untuk Smart-Inventory STTR
Django REST Framework Serializers
"""

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model
from .models import Category, Room, Asset

User = get_user_model()


# ============================================================================
# AUTHENTICATION SERIALIZERS
# ============================================================================

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer yang menambahkan user data ke response
    """
    
    def validate(self, attrs):
        data = super().validate(attrs)
        
        # Tambahkan user data ke response
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'role': self.user.role,
            'phone_number': self.user.phone_number,
        }
        
        return data


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer untuk User model
    """
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'full_name', 'role', 'phone_number', 'is_active',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_full_name(self, obj):
        return obj.get_full_name()


class UserCreateSerializer(serializers.ModelSerializer):
    """
    Serializer untuk create user baru (ADMIN only)
    Auto-generate password 12 karakter
    """
    password = serializers.CharField(
        write_only=True,
        required=False,
        help_text='Password akan di-generate otomatis jika tidak diisi'
    )
    
    class Meta:
        model = User
        fields = [
            'username', 'email', 'first_name', 'last_name',
            'role', 'phone_number', 'password'
        ]
    
    def validate_role(self, value):
        """Validasi role harus valid"""
        valid_roles = [choice[0] for choice in User.ROLE_CHOICES]
        if value not in valid_roles:
            raise serializers.ValidationError(
                f"Role tidak valid. Pilihan: {', '.join(valid_roles)}"
            )
        return value
    
    def create(self, validated_data):
        """
        Create user dengan password ter-hash
        Auto-generate password jika tidak diisi
        """
        import secrets
        import string
        
        # Generate password jika tidak diisi
        if 'password' not in validated_data or not validated_data['password']:
            # Generate random password 12 karakter (alphanumeric)
            alphabet = string.ascii_letters + string.digits
            password = ''.join(secrets.choice(alphabet) for _ in range(12))
            validated_data['password'] = password
        
        # Simpan password untuk return ke response
        plain_password = validated_data['password']
        
        # Create user dengan password ter-hash
        user = User.objects.create_user(**validated_data)
        
        # Attach plain password untuk response (hanya sekali saat create)
        user.plain_password = plain_password
        
        return user


# ============================================================================
# ASSET SERIALIZERS
# ============================================================================

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer untuk Category model
    """
    class Meta:
        model = Category
        fields = ['id', 'name', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']


class RoomSerializer(serializers.ModelSerializer):
    """
    Serializer untuk Room model
    """
    class Meta:
        model = Room
        fields = ['id', 'code', 'name', 'building', 'floor', 'capacity', 'created_at']
        read_only_fields = ['id', 'created_at']


class AssetSerializer(serializers.ModelSerializer):
    """
    Serializer untuk Asset model dengan nested Category dan Room
    """
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(),
        source='category',
        write_only=True
    )
    
    room = RoomSerializer(read_only=True)
    room_id = serializers.PrimaryKeyRelatedField(
        queryset=Room.objects.all(),
        source='room',
        write_only=True,
        required=False,
        allow_null=True
    )
    
    class Meta:
        model = Asset
        fields = [
            'id', 'code', 'name', 'description',
            'category', 'category_id',
            'room', 'room_id',
            'is_space', 'status',
            'purchase_date', 'purchase_price',
            'condition_notes', 'qr_code',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'code', 'created_at', 'updated_at']


class AssetListSerializer(serializers.ModelSerializer):
    """
    Serializer untuk list assets (simplified)
    """
    category_name = serializers.CharField(source='category.name', read_only=True)
    room_code = serializers.CharField(source='room.code', read_only=True)
    
    class Meta:
        model = Asset
        fields = [
            'id', 'code', 'name', 'category_name', 'room_code',
            'is_space', 'status', 'created_at'
        ]


# ============================================================================
# LOAN SERIALIZERS
# ============================================================================

# TODO: Akan diimplementasikan di Task 5


# ============================================================================
# RETURN SERIALIZERS
# ============================================================================

# TODO: Akan diimplementasikan di Task 8


# ============================================================================
# MAINTENANCE SERIALIZERS
# ============================================================================

# TODO: Akan diimplementasikan di Task 11, 12
