"""
Models untuk Smart-Inventory STTR
Database: MySQL 8.0+
"""

from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from datetime import datetime


# ============================================================================
# USER & AUTHENTICATION
# ============================================================================

class User(AbstractUser):
    """
    Custom User model dengan role-based access control (RBAC)
    
    Roles:
    - ADMIN: Full access ke semua fitur
    - STAFF: Manage peminjaman, pengembalian, approval
    - TEKNISI: Manage maintenance tasks, repair budget
    - UKM: Create loan request, view own loans
    
    Extends Django AbstractUser untuk autentikasi built-in
    """
    
    ROLE_CHOICES = [
        ('ADMIN', 'Administrator'),
        ('STAFF', 'Staff Sarpras'),
        ('TEKNISI', 'Teknisi'),
        ('UKM', 'Unit Kegiatan Mahasiswa'),
    ]
    
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        verbose_name='Role',
        help_text='Role user dalam sistem'
    )
    
    phone_number = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name='Nomor Telepon',
        help_text='Nomor telepon untuk notifikasi WhatsApp'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Tanggal Diupdate'
    )
    
    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
    
    def get_full_name(self):
        """
        Return full name dari user
        """
        return f"{self.first_name} {self.last_name}".strip() or self.username
    
    @property
    def is_admin(self):
        """Check apakah user adalah ADMIN"""
        return self.role == 'ADMIN'
    
    @property
    def is_staff_role(self):
        """Check apakah user adalah STAFF"""
        return self.role == 'STAFF'
    
    @property
    def is_teknisi(self):
        """Check apakah user adalah TEKNISI"""
        return self.role == 'TEKNISI'
    
    @property
    def is_ukm(self):
        """Check apakah user adalah UKM"""
        return self.role == 'UKM'


# ============================================================================
# ASET MANAGEMENT
# ============================================================================

class Category(models.Model):
    """
    Kategori aset kampus
    Contoh: Elektronik, Furniture, Alat Lab, Olahraga, dll
    """
    
    name = models.CharField(
        max_length=100,
        unique=True,
        verbose_name='Nama Kategori',
        help_text='Nama kategori aset (contoh: Elektronik, Furniture)'
    )
    
    description = models.TextField(
        null=True,
        blank=True,
        verbose_name='Deskripsi',
        help_text='Deskripsi kategori aset'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    class Meta:
        db_table = 'categories'
        verbose_name = 'Kategori'
        verbose_name_plural = 'Kategori'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Room(models.Model):
    """
    Lokasi/Ruangan tempat aset berada
    """
    
    code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Kode Ruangan',
        help_text='Kode unik ruangan (contoh: A301, Lab-Komputer-1)'
    )
    
    name = models.CharField(
        max_length=200,
        verbose_name='Nama Ruangan',
        help_text='Nama lengkap ruangan'
    )
    
    building = models.CharField(
        max_length=100,
        verbose_name='Gedung',
        help_text='Nama gedung (contoh: Gedung A, Gedung B)'
    )
    
    floor = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='Lantai',
        help_text='Nomor lantai'
    )
    
    capacity = models.IntegerField(
        null=True,
        blank=True,
        verbose_name='Kapasitas',
        help_text='Kapasitas ruangan (jumlah orang)'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    class Meta:
        db_table = 'rooms'
        verbose_name = 'Ruangan'
        verbose_name_plural = 'Ruangan'
        ordering = ['building', 'code']
    
    def __str__(self):
        return f"{self.code} - {self.name}"


class Asset(models.Model):
    """
    Aset kampus (Barang & Ruangan)
    Field is_space membedakan antara barang fisik dan ruangan
    """
    
    STATUS_CHOICES = [
        ('TERSEDIA', 'Tersedia'),
        ('DIPINJAM', 'Sedang Dipinjam'),
        ('PERBAIKAN', 'Dalam Perbaikan'),
        ('RUSAK', 'Rusak'),
    ]
    
    code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Kode Aset',
        help_text='Kode unik aset (format: AST-YYYY-NNN)'
    )
    
    name = models.CharField(
        max_length=200,
        verbose_name='Nama Aset',
        help_text='Nama aset'
    )
    
    description = models.TextField(
        null=True,
        blank=True,
        verbose_name='Deskripsi',
        help_text='Deskripsi detail aset'
    )
    
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        related_name='assets',
        verbose_name='Kategori',
        help_text='Kategori aset'
    )
    
    room = models.ForeignKey(
        Room,
        on_delete=models.PROTECT,
        related_name='assets',
        null=True,
        blank=True,
        verbose_name='Lokasi',
        help_text='Lokasi/ruangan tempat aset berada'
    )
    
    is_space = models.BooleanField(
        default=False,
        verbose_name='Adalah Ruangan',
        help_text='True jika aset adalah ruangan, False jika barang'
    )
    
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='TERSEDIA',
        verbose_name='Status',
        help_text='Status ketersediaan aset'
    )
    
    purchase_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Tanggal Pembelian',
        help_text='Tanggal pembelian aset'
    )
    
    purchase_price = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        null=True,
        blank=True,
        verbose_name='Harga Pembelian',
        help_text='Harga pembelian aset (Rupiah)'
    )
    
    condition_notes = models.TextField(
        null=True,
        blank=True,
        verbose_name='Catatan Kondisi',
        help_text='Catatan kondisi aset'
    )
    
    qr_code = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        verbose_name='QR Code',
        help_text='Path ke file QR code image'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Tanggal Diupdate'
    )
    
    class Meta:
        db_table = 'assets'
        verbose_name = 'Aset'
        verbose_name_plural = 'Aset'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['code']),
            models.Index(fields=['status']),
            models.Index(fields=['category', 'status']),
        ]
    
    def __str__(self):
        return f"{self.code} - {self.name}"
    
    @staticmethod
    def generate_asset_code():
        """
        Generate unique asset code dengan format: AST-YYYY-NNN
        YYYY = tahun sekarang
        NNN = sequential number (3 digit dengan leading zeros)
        """
        current_year = timezone.now().year
        prefix = f"AST-{current_year}-"
        
        # Cari asset code terakhir untuk tahun ini
        last_asset = Asset.objects.filter(
            code__startswith=prefix
        ).order_by('-code').first()
        
        if last_asset:
            # Extract number dari code terakhir
            last_number = int(last_asset.code.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        
        # Format dengan leading zeros (3 digit)
        code = f"{prefix}{new_number:03d}"
        
        return code
    
    def save(self, *args, **kwargs):
        """
        Override save method untuk auto-generate code jika belum ada
        """
        if not self.code:
            self.code = self.generate_asset_code()
        super().save(*args, **kwargs)


# ============================================================================
# PEMINJAMAN
# ============================================================================

class LoanRequest(models.Model):
    """
    Pengajuan peminjaman aset
    Mendukung 2 tipe borrower: GUEST (NIM) dan UKM (Account)
    """
    
    BORROWER_TYPE_CHOICES = [
        ('GUEST', 'Guest (Mahasiswa dengan NIM)'),
        ('UKM', 'UKM Account'),
    ]
    
    LOAN_STATUS_CHOICES = [
        ('PENDING', 'Menunggu Persetujuan'),
        ('APPROVED', 'Disetujui'),
        ('REJECTED', 'Ditolak'),
        ('RETURNED', 'Sudah Dikembalikan'),
    ]
    
    loan_code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Kode Peminjaman',
        help_text='Kode unik peminjaman (format: PJM-YYYY-NNN)'
    )
    
    # Borrower Type
    borrower_type = models.CharField(
        max_length=20,
        choices=BORROWER_TYPE_CHOICES,
        verbose_name='Tipe Peminjam',
        help_text='Tipe peminjam: Guest (NIM) atau UKM Account'
    )
    
    # Untuk Guest (Mahasiswa dengan NIM)
    guest_nim = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name='NIM Mahasiswa',
        help_text='NIM mahasiswa (untuk borrower_type GUEST)'
    )
    
    guest_name = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        verbose_name='Nama Mahasiswa',
        help_text='Nama mahasiswa (untuk borrower_type GUEST)'
    )
    
    guest_phone = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name='Nomor Telepon Mahasiswa',
        help_text='Nomor telepon mahasiswa (untuk borrower_type GUEST)'
    )
    
    # Untuk UKM Account
    ukm_account = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='loan_requests',
        null=True,
        blank=True,
        verbose_name='Akun UKM',
        help_text='Akun UKM yang meminjam (untuk borrower_type UKM)'
    )
    
    # Informasi Peminjaman
    loan_date = models.DateField(
        verbose_name='Tanggal Pinjam',
        help_text='Tanggal mulai peminjaman'
    )
    
    return_date = models.DateField(
        verbose_name='Tanggal Kembali',
        help_text='Tanggal rencana pengembalian'
    )
    
    purpose = models.TextField(
        verbose_name='Keperluan',
        help_text='Keperluan/tujuan peminjaman'
    )
    
    status = models.CharField(
        max_length=20,
        choices=LOAN_STATUS_CHOICES,
        default='PENDING',
        verbose_name='Status',
        help_text='Status peminjaman'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Tanggal Diupdate'
    )
    
    class Meta:
        db_table = 'loan_requests'
        verbose_name = 'Peminjaman'
        verbose_name_plural = 'Peminjaman'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['loan_code']),
            models.Index(fields=['status']),
            models.Index(fields=['borrower_type', 'status']),
            models.Index(fields=['guest_nim']),
        ]
    
    def __str__(self):
        if self.borrower_type == 'GUEST':
            return f"{self.loan_code} - {self.guest_name} ({self.guest_nim})"
        else:
            return f"{self.loan_code} - {self.ukm_account.get_full_name()}"
    
    @staticmethod
    def generate_loan_code():
        """
        Generate unique loan code dengan format: PJM-YYYY-NNN
        YYYY = tahun sekarang
        NNN = sequential number (3 digit dengan leading zeros)
        """
        current_year = timezone.now().year
        prefix = f"PJM-{current_year}-"
        
        # Cari loan code terakhir untuk tahun ini
        last_loan = LoanRequest.objects.filter(
            loan_code__startswith=prefix
        ).order_by('-loan_code').first()
        
        if last_loan:
            # Extract number dari code terakhir
            last_number = int(last_loan.loan_code.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        
        # Format dengan leading zeros (3 digit)
        code = f"{prefix}{new_number:03d}"
        
        return code
    
    def save(self, *args, **kwargs):
        """
        Override save method untuk:
        1. Auto-generate loan_code jika belum ada
        2. Validasi borrower type integrity
        """
        # Auto-generate loan_code
        if not self.loan_code:
            self.loan_code = self.generate_loan_code()
        
        # Validasi borrower type integrity
        if self.borrower_type == 'GUEST':
            if not all([self.guest_nim, self.guest_name, self.guest_phone]):
                raise ValueError(
                    "Untuk borrower_type GUEST, field guest_nim, guest_name, dan guest_phone wajib diisi"
                )
            if self.ukm_account:
                raise ValueError(
                    "Untuk borrower_type GUEST, field ukm_account harus NULL"
                )
        elif self.borrower_type == 'UKM':
            if not self.ukm_account:
                raise ValueError(
                    "Untuk borrower_type UKM, field ukm_account wajib diisi"
                )
            if any([self.guest_nim, self.guest_name, self.guest_phone]):
                raise ValueError(
                    "Untuk borrower_type UKM, field guest_nim, guest_name, dan guest_phone harus NULL"
                )
        
        # Validasi return_date >= loan_date
        if self.return_date < self.loan_date:
            raise ValueError(
                "Tanggal kembali harus lebih besar atau sama dengan tanggal pinjam"
            )
        
        super().save(*args, **kwargs)


class LoanItem(models.Model):
    """
    Item aset yang dipinjam dalam satu LoanRequest
    Satu peminjaman bisa meminjam multiple aset
    """
    
    loan_request = models.ForeignKey(
        LoanRequest,
        on_delete=models.CASCADE,
        related_name='items',
        verbose_name='Peminjaman',
        help_text='Peminjaman terkait'
    )
    
    asset = models.ForeignKey(
        Asset,
        on_delete=models.PROTECT,
        related_name='loan_items',
        verbose_name='Aset',
        help_text='Aset yang dipinjam'
    )
    
    quantity = models.IntegerField(
        default=1,
        verbose_name='Jumlah',
        help_text='Jumlah aset yang dipinjam'
    )
    
    notes = models.TextField(
        null=True,
        blank=True,
        verbose_name='Catatan',
        help_text='Catatan tambahan untuk item ini'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    class Meta:
        db_table = 'loan_items'
        verbose_name = 'Item Peminjaman'
        verbose_name_plural = 'Item Peminjaman'
        ordering = ['id']
    
    def __str__(self):
        return f"{self.loan_request.loan_code} - {self.asset.name} (x{self.quantity})"


class ApprovalLog(models.Model):
    """
    Log approval/rejection peminjaman
    Tracking siapa yang approve/reject dan kapan
    """
    
    ACTION_CHOICES = [
        ('SUBMITTED', 'Diajukan'),
        ('APPROVED', 'Disetujui'),
        ('REJECTED', 'Ditolak'),
    ]
    
    loan_request = models.ForeignKey(
        LoanRequest,
        on_delete=models.CASCADE,
        related_name='approval_logs',
        verbose_name='Peminjaman',
        help_text='Peminjaman terkait'
    )
    
    action = models.CharField(
        max_length=20,
        choices=ACTION_CHOICES,
        verbose_name='Aksi',
        help_text='Aksi yang dilakukan'
    )
    
    approver = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='approval_logs',
        null=True,
        blank=True,
        verbose_name='Approver',
        help_text='Staff yang approve/reject (NULL untuk SUBMITTED)'
    )
    
    notes = models.TextField(
        null=True,
        blank=True,
        verbose_name='Catatan',
        help_text='Catatan/alasan approval atau rejection'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal'
    )
    
    class Meta:
        db_table = 'approval_logs'
        verbose_name = 'Log Approval'
        verbose_name_plural = 'Log Approval'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.loan_request.loan_code} - {self.get_action_display()}"


# ============================================================================
# PENGEMBALIAN
# ============================================================================

class ReturnLog(models.Model):
    """
    Log pengembalian aset
    Mencatat tanggal kembali, kondisi, dan admin penerima
    """
    
    CONDITION_CHOICES = [
        ('BAIK', 'Baik'),
        ('RUSAK', 'Rusak'),
    ]
    
    loan_request = models.OneToOneField(
        LoanRequest,
        on_delete=models.PROTECT,
        related_name='return_log',
        verbose_name='Peminjaman',
        help_text='Peminjaman yang dikembalikan'
    )
    
    return_date = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Kembali',
        help_text='Tanggal pengembalian aset'
    )
    
    condition = models.CharField(
        max_length=20,
        choices=CONDITION_CHOICES,
        verbose_name='Kondisi',
        help_text='Kondisi aset saat dikembalikan'
    )
    
    completeness_notes = models.TextField(
        null=True,
        blank=True,
        verbose_name='Catatan Kelengkapan',
        help_text='Checklist kelengkapan aset'
    )
    
    damage_notes = models.TextField(
        null=True,
        blank=True,
        verbose_name='Catatan Kerusakan',
        help_text='Catatan kerusakan jika ada'
    )
    
    received_by = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='received_returns',
        verbose_name='Diterima Oleh',
        help_text='Admin/Staff yang menerima pengembalian'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    class Meta:
        db_table = 'return_logs'
        verbose_name = 'Log Pengembalian'
        verbose_name_plural = 'Log Pengembalian'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.loan_request.loan_code} - Dikembalikan ({self.get_condition_display()})"


# ============================================================================
# PEMELIHARAAN
# ============================================================================

class DamageReport(models.Model):
    """
    Laporan kerusakan aset
    Bisa dibuat manual atau auto-generated dari pengembalian rusak
    """
    
    SOURCE_CHOICES = [
        ('MANUAL', 'Manual'),
        ('AUTO_RETURN', 'Auto dari Pengembalian'),
    ]
    
    report_code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Kode Laporan',
        help_text='Kode unik laporan kerusakan (format: DMG-YYYY-NNN)'
    )
    
    asset = models.ForeignKey(
        Asset,
        on_delete=models.PROTECT,
        related_name='damage_reports',
        verbose_name='Aset',
        help_text='Aset yang rusak'
    )
    
    reporter_name = models.CharField(
        max_length=200,
        verbose_name='Nama Pelapor',
        help_text='Nama orang yang melaporkan kerusakan'
    )
    
    reporter_phone = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name='Nomor Telepon Pelapor',
        help_text='Nomor telepon pelapor'
    )
    
    description = models.TextField(
        verbose_name='Deskripsi Kerusakan',
        help_text='Deskripsi detail kerusakan'
    )
    
    photo_url = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name='URL Foto',
        help_text='Path ke foto bukti kerusakan'
    )
    
    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default='MANUAL',
        verbose_name='Sumber',
        help_text='Sumber laporan: Manual atau Auto dari pengembalian'
    )
    
    reported_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dilaporkan'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    class Meta:
        db_table = 'damage_reports'
        verbose_name = 'Laporan Kerusakan'
        verbose_name_plural = 'Laporan Kerusakan'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['report_code']),
            models.Index(fields=['source']),
        ]
    
    def __str__(self):
        return f"{self.report_code} - {self.asset.name}"
    
    @staticmethod
    def generate_damage_report_code():
        """
        Generate unique damage report code dengan format: DMG-YYYY-NNN
        YYYY = tahun sekarang
        NNN = sequential number (3 digit dengan leading zeros)
        """
        current_year = timezone.now().year
        prefix = f"DMG-{current_year}-"
        
        # Cari report code terakhir untuk tahun ini
        last_report = DamageReport.objects.filter(
            report_code__startswith=prefix
        ).order_by('-report_code').first()
        
        if last_report:
            # Extract number dari code terakhir
            last_number = int(last_report.report_code.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        
        # Format dengan leading zeros (3 digit)
        code = f"{prefix}{new_number:03d}"
        
        return code
    
    def save(self, *args, **kwargs):
        """
        Override save method untuk auto-generate report_code jika belum ada
        """
        if not self.report_code:
            self.report_code = self.generate_damage_report_code()
        super().save(*args, **kwargs)


class MaintenanceTask(models.Model):
    """
    Task pemeliharaan/perbaikan aset
    Status: MENUNGGU, PROSES, SELESAI
    """
    
    TASK_STATUS_CHOICES = [
        ('MENUNGGU', 'Menunggu'),
        ('PROSES', 'Dalam Proses'),
        ('SELESAI', 'Selesai'),
    ]
    
    PRIORITY_CHOICES = [
        ('LOW', 'Rendah'),
        ('MEDIUM', 'Sedang'),
        ('HIGH', 'Tinggi'),
        ('URGENT', 'Mendesak'),
    ]
    
    task_code = models.CharField(
        max_length=50,
        unique=True,
        verbose_name='Kode Task',
        help_text='Kode unik task pemeliharaan (format: MNT-YYYY-NNN)'
    )
    
    asset = models.ForeignKey(
        Asset,
        on_delete=models.PROTECT,
        related_name='maintenance_tasks',
        verbose_name='Aset',
        help_text='Aset yang akan diperbaiki'
    )
    
    damage_report = models.ForeignKey(
        DamageReport,
        on_delete=models.SET_NULL,
        related_name='maintenance_tasks',
        null=True,
        blank=True,
        verbose_name='Laporan Kerusakan',
        help_text='Laporan kerusakan terkait (jika ada)'
    )
    
    title = models.CharField(
        max_length=200,
        verbose_name='Judul Task',
        help_text='Judul singkat task pemeliharaan'
    )
    
    description = models.TextField(
        verbose_name='Deskripsi',
        help_text='Deskripsi detail pekerjaan yang harus dilakukan'
    )
    
    status = models.CharField(
        max_length=20,
        choices=TASK_STATUS_CHOICES,
        default='MENUNGGU',
        verbose_name='Status',
        help_text='Status task pemeliharaan'
    )
    
    assigned_to = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='assigned_maintenance_tasks',
        null=True,
        blank=True,
        verbose_name='Ditugaskan Ke',
        help_text='Teknisi yang ditugaskan'
    )
    
    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default='MEDIUM',
        verbose_name='Prioritas',
        help_text='Prioritas task'
    )
    
    scheduled_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Tanggal Dijadwalkan',
        help_text='Tanggal rencana perbaikan'
    )
    
    completed_date = models.DateField(
        null=True,
        blank=True,
        verbose_name='Tanggal Selesai',
        help_text='Tanggal selesai perbaikan'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Tanggal Diupdate'
    )
    
    class Meta:
        db_table = 'maintenance_tasks'
        verbose_name = 'Task Pemeliharaan'
        verbose_name_plural = 'Task Pemeliharaan'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['task_code']),
            models.Index(fields=['status']),
            models.Index(fields=['priority']),
        ]
    
    def __str__(self):
        return f"{self.task_code} - {self.title}"
    
    @staticmethod
    def generate_maintenance_task_code():
        """
        Generate unique maintenance task code dengan format: MNT-YYYY-NNN
        YYYY = tahun sekarang
        NNN = sequential number (3 digit dengan leading zeros)
        """
        current_year = timezone.now().year
        prefix = f"MNT-{current_year}-"
        
        # Cari task code terakhir untuk tahun ini
        last_task = MaintenanceTask.objects.filter(
            task_code__startswith=prefix
        ).order_by('-task_code').first()
        
        if last_task:
            # Extract number dari code terakhir
            last_number = int(last_task.task_code.split('-')[-1])
            new_number = last_number + 1
        else:
            new_number = 1
        
        # Format dengan leading zeros (3 digit)
        code = f"{prefix}{new_number:03d}"
        
        return code
    
    def save(self, *args, **kwargs):
        """
        Override save method untuk auto-generate task_code jika belum ada
        """
        if not self.task_code:
            self.task_code = self.generate_maintenance_task_code()
        super().save(*args, **kwargs)


class RepairBudget(models.Model):
    """
    Detail anggaran perbaikan
    Mencatat sparepart dan biaya jasa
    """
    
    maintenance_task = models.OneToOneField(
        MaintenanceTask,
        on_delete=models.CASCADE,
        related_name='repair_budget',
        verbose_name='Task Pemeliharaan',
        help_text='Task pemeliharaan terkait'
    )
    
    sparepart_details = models.JSONField(
        verbose_name='Detail Sparepart',
        help_text='Array of {name, qty, unit_price, total}'
    )
    
    sparepart_total = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        verbose_name='Total Sparepart',
        help_text='Total biaya sparepart'
    )
    
    labor_cost = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        verbose_name='Biaya Jasa',
        help_text='Biaya jasa teknisi'
    )
    
    other_cost = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0,
        verbose_name='Biaya Lain-lain',
        help_text='Biaya tambahan lainnya'
    )
    
    total_cost = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        verbose_name='Total Biaya',
        help_text='Total biaya keseluruhan'
    )
    
    notes = models.TextField(
        null=True,
        blank=True,
        verbose_name='Catatan',
        help_text='Catatan tambahan'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name='Tanggal Diupdate'
    )
    
    class Meta:
        db_table = 'repair_budgets'
        verbose_name = 'Anggaran Perbaikan'
        verbose_name_plural = 'Anggaran Perbaikan'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Budget untuk {self.maintenance_task.task_code}"


class RepairLog(models.Model):
    """
    Riwayat final perbaikan
    Dibuat ketika MaintenanceTask selesai
    """
    
    RESULT_CHOICES = [
        ('SUCCESS', 'Berhasil'),
        ('PARTIAL', 'Sebagian'),
        ('FAILED', 'Gagal'),
    ]
    
    maintenance_task = models.ForeignKey(
        MaintenanceTask,
        on_delete=models.PROTECT,
        related_name='repair_logs',
        verbose_name='Task Pemeliharaan',
        help_text='Task pemeliharaan terkait'
    )
    
    asset = models.ForeignKey(
        Asset,
        on_delete=models.PROTECT,
        related_name='repair_logs',
        verbose_name='Aset',
        help_text='Aset yang diperbaiki'
    )
    
    technician = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name='repair_logs',
        verbose_name='Teknisi',
        help_text='Teknisi yang melakukan perbaikan'
    )
    
    work_description = models.TextField(
        verbose_name='Deskripsi Pekerjaan',
        help_text='Deskripsi pekerjaan yang dilakukan'
    )
    
    result = models.CharField(
        max_length=20,
        choices=RESULT_CHOICES,
        verbose_name='Hasil',
        help_text='Hasil perbaikan'
    )
    
    completion_date = models.DateTimeField(
        verbose_name='Tanggal Selesai',
        help_text='Tanggal selesai perbaikan'
    )
    
    total_cost = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        verbose_name='Total Biaya',
        help_text='Total biaya perbaikan'
    )
    
    notes = models.TextField(
        null=True,
        blank=True,
        verbose_name='Catatan',
        help_text='Catatan tambahan'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal Dibuat'
    )
    
    class Meta:
        db_table = 'repair_logs'
        verbose_name = 'Log Perbaikan'
        verbose_name_plural = 'Log Perbaikan'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.maintenance_task.task_code} - {self.get_result_display()}"


# ============================================================================
# SISTEM
# ============================================================================

class AuditLog(models.Model):
    """
    Audit trail untuk tracking aktivitas penting
    """
    
    user = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        related_name='audit_logs',
        null=True,
        blank=True,
        verbose_name='User',
        help_text='User yang melakukan aksi'
    )
    
    action = models.CharField(
        max_length=50,
        verbose_name='Aksi',
        help_text='Aksi yang dilakukan (CREATE_LOAN, APPROVE_LOAN, dll)'
    )
    
    entity_type = models.CharField(
        max_length=50,
        verbose_name='Tipe Entitas',
        help_text='Tipe entitas (LoanRequest, Asset, MaintenanceTask, dll)'
    )
    
    entity_id = models.IntegerField(
        verbose_name='ID Entitas',
        help_text='ID dari entitas yang diakses'
    )
    
    description = models.TextField(
        verbose_name='Deskripsi',
        help_text='Deskripsi detail aksi'
    )
    
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        verbose_name='IP Address',
        help_text='IP address user'
    )
    
    user_agent = models.CharField(
        max_length=500,
        null=True,
        blank=True,
        verbose_name='User Agent',
        help_text='User agent browser'
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name='Tanggal'
    )
    
    class Meta:
        db_table = 'audit_logs'
        verbose_name = 'Log Audit'
        verbose_name_plural = 'Log Audit'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['action']),
            models.Index(fields=['entity_type']),
            models.Index(fields=['created_at']),
        ]
    
    def __str__(self):
        return f"{self.action} - {self.entity_type} #{self.entity_id}"
