"""
Django Admin Configuration untuk Smart-Inventory STTR
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth import get_user_model
from .models import (
    Category, Room, Asset, LoanRequest, LoanItem, ApprovalLog,
    ReturnLog, DamageReport, MaintenanceTask, RepairBudget, RepairLog, AuditLog
)

User = get_user_model()


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """
    Custom User Admin dengan role field
    """
    list_display = ['username', 'email', 'first_name', 'last_name', 'role', 'is_active', 'created_at']
    list_filter = ['role', 'is_active', 'is_staff', 'is_superuser']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone_number']
    ordering = ['-created_at']
    
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Informasi Tambahan', {
            'fields': ('role', 'phone_number', 'created_at', 'updated_at')
        }),
    )
    
    readonly_fields = ['created_at', 'updated_at']
    
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Informasi Tambahan', {
            'fields': ('role', 'phone_number')
        }),
    )


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    """
    Admin untuk Category model
    """
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name', 'description']
    ordering = ['name']
    readonly_fields = ['created_at']


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    """
    Admin untuk Room model
    """
    list_display = ['code', 'name', 'building', 'floor', 'capacity', 'created_at']
    list_filter = ['building', 'floor']
    search_fields = ['code', 'name', 'building']
    ordering = ['building', 'code']
    readonly_fields = ['created_at']


@admin.register(Asset)
class AssetAdmin(admin.ModelAdmin):
    """
    Admin untuk Asset model
    """
    list_display = ['code', 'name', 'category', 'room', 'status', 'is_space', 'created_at']
    list_filter = ['status', 'is_space', 'category', 'room']
    search_fields = ['code', 'name', 'description']
    ordering = ['-created_at']
    readonly_fields = ['code', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Informasi Dasar', {
            'fields': ('code', 'name', 'description', 'category', 'room', 'is_space')
        }),
        ('Status & Kondisi', {
            'fields': ('status', 'condition_notes')
        }),
        ('Informasi Pembelian', {
            'fields': ('purchase_date', 'purchase_price')
        }),
        ('QR Code', {
            'fields': ('qr_code',)
        }),
        ('Timestamp', {
            'fields': ('created_at', 'updated_at')
        }),
    )


class LoanItemInline(admin.TabularInline):
    """
    Inline admin untuk LoanItem
    """
    model = LoanItem
    extra = 1
    fields = ['asset', 'quantity', 'notes']


class ApprovalLogInline(admin.TabularInline):
    """
    Inline admin untuk ApprovalLog
    """
    model = ApprovalLog
    extra = 0
    fields = ['action', 'approver', 'notes', 'created_at']
    readonly_fields = ['created_at']
    can_delete = False


@admin.register(LoanRequest)
class LoanRequestAdmin(admin.ModelAdmin):
    """
    Admin untuk LoanRequest model
    """
    list_display = ['loan_code', 'borrower_display', 'loan_date', 'return_date', 'status', 'created_at']
    list_filter = ['status', 'borrower_type', 'loan_date', 'return_date']
    search_fields = ['loan_code', 'guest_nim', 'guest_name', 'ukm_account__username', 'purpose']
    ordering = ['-created_at']
    readonly_fields = ['loan_code', 'created_at', 'updated_at']
    inlines = [LoanItemInline, ApprovalLogInline]
    
    fieldsets = (
        ('Informasi Peminjaman', {
            'fields': ('loan_code', 'borrower_type', 'loan_date', 'return_date', 'purpose', 'status')
        }),
        ('Peminjam Guest (Mahasiswa)', {
            'fields': ('guest_nim', 'guest_name', 'guest_phone'),
            'classes': ('collapse',)
        }),
        ('Peminjam UKM', {
            'fields': ('ukm_account',),
            'classes': ('collapse',)
        }),
        ('Timestamp', {
            'fields': ('created_at', 'updated_at')
        }),
    )
    
    def borrower_display(self, obj):
        """Display borrower name"""
        if obj.borrower_type == 'GUEST':
            return f"{obj.guest_name} ({obj.guest_nim})"
        else:
            return obj.ukm_account.get_full_name()
    borrower_display.short_description = 'Peminjam'


@admin.register(ApprovalLog)
class ApprovalLogAdmin(admin.ModelAdmin):
    """
    Admin untuk ApprovalLog model
    """
    list_display = ['loan_request', 'action', 'approver', 'created_at']
    list_filter = ['action', 'created_at']
    search_fields = ['loan_request__loan_code', 'approver__username', 'notes']
    ordering = ['-created_at']
    readonly_fields = ['created_at']


# ============================================================================
# PENGEMBALIAN
# ============================================================================

@admin.register(ReturnLog)
class ReturnLogAdmin(admin.ModelAdmin):
    """
    Admin untuk ReturnLog model
    """
    list_display = ['loan_request', 'condition', 'received_by', 'return_date', 'created_at']
    list_filter = ['condition', 'return_date']
    search_fields = ['loan_request__loan_code', 'received_by__username', 'damage_notes']
    ordering = ['-created_at']
    readonly_fields = ['return_date', 'created_at']
    
    fieldsets = (
        ('Informasi Pengembalian', {
            'fields': ('loan_request', 'condition', 'received_by', 'return_date')
        }),
        ('Catatan', {
            'fields': ('completeness_notes', 'damage_notes')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )


# ============================================================================
# PEMELIHARAAN
# ============================================================================

@admin.register(DamageReport)
class DamageReportAdmin(admin.ModelAdmin):
    """
    Admin untuk DamageReport model
    """
    list_display = ['report_code', 'asset', 'reporter_name', 'source', 'reported_at']
    list_filter = ['source', 'reported_at']
    search_fields = ['report_code', 'asset__name', 'reporter_name', 'description']
    ordering = ['-created_at']
    readonly_fields = ['report_code', 'reported_at', 'created_at']
    
    fieldsets = (
        ('Informasi Laporan', {
            'fields': ('report_code', 'asset', 'source', 'reported_at')
        }),
        ('Pelapor', {
            'fields': ('reporter_name', 'reporter_phone')
        }),
        ('Detail Kerusakan', {
            'fields': ('description', 'photo_url')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )


@admin.register(MaintenanceTask)
class MaintenanceTaskAdmin(admin.ModelAdmin):
    """
    Admin untuk MaintenanceTask model
    """
    list_display = ['task_code', 'asset', 'title', 'status', 'priority', 'assigned_to', 'created_at']
    list_filter = ['status', 'priority', 'scheduled_date']
    search_fields = ['task_code', 'asset__name', 'title', 'description']
    ordering = ['-created_at']
    readonly_fields = ['task_code', 'created_at', 'updated_at']
    
    fieldsets = (
        ('Informasi Task', {
            'fields': ('task_code', 'asset', 'damage_report', 'title', 'description')
        }),
        ('Status & Prioritas', {
            'fields': ('status', 'priority', 'assigned_to')
        }),
        ('Jadwal', {
            'fields': ('scheduled_date', 'completed_date')
        }),
        ('Timestamp', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(RepairBudget)
class RepairBudgetAdmin(admin.ModelAdmin):
    """
    Admin untuk RepairBudget model
    """
    list_display = ['maintenance_task', 'sparepart_total', 'labor_cost', 'total_cost', 'created_at']
    search_fields = ['maintenance_task__task_code', 'notes']
    ordering = ['-created_at']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Task Pemeliharaan', {
            'fields': ('maintenance_task',)
        }),
        ('Detail Biaya', {
            'fields': ('sparepart_details', 'sparepart_total', 'labor_cost', 'other_cost', 'total_cost')
        }),
        ('Catatan', {
            'fields': ('notes',)
        }),
        ('Timestamp', {
            'fields': ('created_at', 'updated_at')
        }),
    )


@admin.register(RepairLog)
class RepairLogAdmin(admin.ModelAdmin):
    """
    Admin untuk RepairLog model
    """
    list_display = ['maintenance_task', 'asset', 'technician', 'result', 'completion_date', 'total_cost']
    list_filter = ['result', 'completion_date']
    search_fields = ['maintenance_task__task_code', 'asset__name', 'technician__username', 'work_description']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Informasi Perbaikan', {
            'fields': ('maintenance_task', 'asset', 'technician', 'completion_date')
        }),
        ('Detail Pekerjaan', {
            'fields': ('work_description', 'result', 'total_cost')
        }),
        ('Catatan', {
            'fields': ('notes',)
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )


# ============================================================================
# SISTEM
# ============================================================================

@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    """
    Admin untuk AuditLog model
    """
    list_display = ['user', 'action', 'entity_type', 'entity_id', 'created_at']
    list_filter = ['action', 'entity_type', 'created_at']
    search_fields = ['user__username', 'action', 'entity_type', 'description']
    ordering = ['-created_at']
    readonly_fields = ['created_at']
    
    fieldsets = (
        ('Informasi Aksi', {
            'fields': ('user', 'action', 'entity_type', 'entity_id')
        }),
        ('Detail', {
            'fields': ('description',)
        }),
        ('Request Info', {
            'fields': ('ip_address', 'user_agent')
        }),
        ('Timestamp', {
            'fields': ('created_at',)
        }),
    )
