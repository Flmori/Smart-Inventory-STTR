# Task 3 & Task 5.1: Model Aset & LoanRequest - COMPLETED ✅

## Task 3: Model Aset & Lokasi

### Yang Sudah Dibuat

#### 1. Model Category

**File:** `backend/inventory/models.py`

**Purpose:** Kategori aset kampus (Elektronik, Furniture, Alat Lab, Olahraga, dll)

**Fields:**
```python
- id (AutoField, PK)
- name (CharField, unique, max_length=100)
- description (TextField, nullable)
- created_at (DateTimeField, auto_now_add)
```

**Relasi:**
- One-to-Many dengan Asset

#### 2. Model Room

**Purpose:** Lokasi/Ruangan tempat aset berada

**Fields:**
```python
- id (AutoField, PK)
- code (CharField, unique, max_length=50)  # Contoh: A301, Lab-Komputer-1
- name (CharField, max_length=200)
- building (CharField, max_length=100)  # Gedung A, B, C, dll
- floor (IntegerField, nullable)
- capacity (IntegerField, nullable)  # Kapasitas ruangan
- created_at (DateTimeField, auto_now_add)
```

**Relasi:**
- One-to-Many dengan Asset

#### 3. Model Asset

**Purpose:** Aset kampus (Barang & Ruangan)

**Fields:**
```python
- id (AutoField, PK)
- code (CharField, unique, max_length=50)  # AST-YYYY-NNN (auto-generated)
- name (CharField, max_length=200)
- description (TextField, nullable)
- category (ForeignKey to Category, PROTECT)
- room (ForeignKey to Room, PROTECT, nullable)
- is_space (BooleanField, default=False)  # True jika aset adalah ruangan
- status (CharField, choices=STATUS_CHOICES)
  # STATUS_CHOICES: TERSEDIA, DIPINJAM, PERBAIKAN, RUSAK
- purchase_date (DateField, nullable)
- purchase_price (DecimalField, max_digits=15, decimal_places=2, nullable)
- condition_notes (TextField, nullable)
- qr_code (CharField, max_length=255, nullable)
- created_at (DateTimeField, auto_now_add)
- updated_at (DateTimeField, auto_now)
```

**Relasi:**
- Many-to-One dengan Category
- Many-to-One dengan Room
- One-to-Many dengan LoanItem

**Special Features:**
- **Auto-generate code**: Method `generate_asset_code()` untuk generate code AST-YYYY-NNN
- **Database indexes**: Pada fields code, status, dan (category, status)
- **Override save()**: Auto-generate code jika belum ada

#### 4. API Endpoints untuk Asset Management

**Endpoints:**
```
GET    /api/v1/categories          - List categories
POST   /api/v1/categories          - Create category (ADMIN/STAFF)
GET    /api/v1/categories/{id}     - Get category detail
PUT    /api/v1/categories/{id}     - Update category (ADMIN/STAFF)
DELETE /api/v1/categories/{id}     - Delete category (ADMIN)

GET    /api/v1/rooms               - List rooms
POST   /api/v1/rooms               - Create room (ADMIN/STAFF)
GET    /api/v1/rooms/{id}          - Get room detail
PUT    /api/v1/rooms/{id}          - Update room (ADMIN/STAFF)
DELETE /api/v1/rooms/{id}          - Delete room (ADMIN)

GET    /api/v1/assets              - List assets (dengan filter & search)
POST   /api/v1/assets              - Create asset (ADMIN/STAFF)
GET    /api/v1/assets/{id}         - Get asset detail
PUT    /api/v1/assets/{id}         - Update asset (ADMIN/STAFF)
DELETE /api/v1/assets/{id}         - Delete asset (ADMIN)
```

**Query Parameters untuk Assets:**
- `category`: Filter by category ID
- `status`: Filter by status (TERSEDIA, DIPINJAM, PERBAIKAN, RUSAK)
- `is_space`: Filter by is_space (true/false)
- `search`: Search by code, name, description

**Example Requests:**
```
GET /api/v1/assets?category=1&status=TERSEDIA
GET /api/v1/assets?is_space=false&search=proyektor
GET /api/v1/rooms?building=Gedung A
```

---

## Task 5.1: Model LoanRequest (Hybrid Borrower)

### Yang Sudah Dibuat

#### 1. Model LoanRequest

**File:** `backend/inventory/models.py`

**Purpose:** Pengajuan peminjaman aset dengan support untuk 2 tipe borrower

**Hybrid Borrower System:**
- **GUEST**: Mahasiswa dengan NIM (tanpa akun login)
- **UKM**: Akun UKM (dengan login)

**Fields:**
```python
- id (AutoField, PK)
- loan_code (CharField, unique, max_length=50)  # PJM-YYYY-NNN (auto-generated)

# Borrower Type
- borrower_type (CharField, choices=BORROWER_TYPE_CHOICES)
  # BORROWER_TYPE_CHOICES: GUEST, UKM

# Untuk Guest (Mahasiswa)
- guest_nim (CharField, max_length=20, nullable)
- guest_name (CharField, max_length=200, nullable)
- guest_phone (CharField, max_length=20, nullable)

# Untuk UKM Account
- ukm_account (ForeignKey to User, PROTECT, nullable)

# Informasi Peminjaman
- loan_date (DateField)
- return_date (DateField)
- purpose (TextField)
- status (CharField, choices=LOAN_STATUS_CHOICES)
  # LOAN_STATUS_CHOICES: PENDING, APPROVED, REJECTED, RETURNED

- created_at (DateTimeField, auto_now_add)
- updated_at (DateTimeField, auto_now)
```

**Relasi:**
- Many-to-One dengan User (ukm_account, nullable)
- One-to-Many dengan LoanItem
- One-to-Many dengan ApprovalLog

**Special Features:**
- **Auto-generate code**: Method `generate_loan_code()` untuk generate code PJM-YYYY-NNN
- **Borrower type validation**: Override `save()` untuk validasi integrity
  - Jika GUEST: guest_nim, guest_name, guest_phone wajib diisi, ukm_account harus NULL
  - Jika UKM: ukm_account wajib diisi, guest fields harus NULL
- **Date validation**: return_date harus >= loan_date
- **Database indexes**: Pada fields loan_code, status, (borrower_type, status), guest_nim

#### 2. Model LoanItem

**Purpose:** Item aset yang dipinjam (many-to-many relationship)

**Fields:**
```python
- id (AutoField, PK)
- loan_request (ForeignKey to LoanRequest, CASCADE)
- asset (ForeignKey to Asset, PROTECT)
- quantity (IntegerField, default=1)
- notes (TextField, nullable)
- created_at (DateTimeField, auto_now_add)
```

**Relasi:**
- Many-to-One dengan LoanRequest
- Many-to-One dengan Asset

#### 3. Model ApprovalLog

**Purpose:** Log approval/rejection peminjaman untuk tracking

**Fields:**
```python
- id (AutoField, PK)
- loan_request (ForeignKey to LoanRequest, CASCADE)
- action (CharField, choices=ACTION_CHOICES)
  # ACTION_CHOICES: SUBMITTED, APPROVED, REJECTED
- approver (ForeignKey to User, PROTECT, nullable)
- notes (TextField, nullable)
- created_at (DateTimeField, auto_now_add)
```

**Relasi:**
- Many-to-One dengan LoanRequest
- Many-to-One dengan User (approver)

---

## Database Schema (ERD)

```
┌─────────────┐
│   Category  │
├─────────────┤
│ id (PK)     │
│ name        │
│ description │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐       ┌─────────────┐
│    Asset    │       │    Room     │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ code        │◄──N:1─┤ code        │
│ name        │       │ name        │
│ category_id │       │ building    │
│ room_id     │       │ floor       │
│ is_space    │       │ capacity    │
│ status      │       └─────────────┘
│ ...         │
└──────┬──────┘
       │
       │ 1:N
       │
┌──────▼──────┐       ┌─────────────┐
│  LoanItem   │       │ LoanRequest │
├─────────────┤       ├─────────────┤
│ id (PK)     │       │ id (PK)     │
│ loan_req_id │◄──N:1─┤ loan_code   │
│ asset_id    │       │ borrower_   │
│ quantity    │       │   type      │
│ notes       │       │ guest_nim   │
└─────────────┘       │ guest_name  │
                      │ guest_phone │
       ┌──────────────┤ ukm_account │
       │              │ loan_date   │
       │ 1:N          │ return_date │
       │              │ purpose     │
┌──────▼──────┐       │ status      │
│ApprovalLog  │       └──────┬──────┘
├─────────────┤              │
│ id (PK)     │              │ N:1
│ loan_req_id │              │
│ action      │       ┌──────▼──────┐
│ approver_id │◄──N:1─┤    User     │
│ notes       │       ├─────────────┤
└─────────────┘       │ id (PK)     │
                      │ username    │
                      │ role        │
                      │ ...         │
                      └─────────────┘
```

---

## Cara Testing

### 1. Run Migrations

```bash
# Pastikan database sudah dibuat
# Jika belum, jalankan: setup_database.bat

# Run migrations
python manage.py migrate
```

### 2. Create Sample Data via Django Admin

```bash
# Buka Django admin
python manage.py runserver
# Akses: http://localhost:8000/admin

# Login dengan superuser
# Create sample data:
# - 3-5 Categories (Elektronik, Furniture, Alat Lab, dll)
# - 5-10 Rooms (A301, Lab-Komputer-1, dll)
# - 10-20 Assets (Proyektor, Kursi, Laptop, dll)
```

### 3. Test API Endpoints dengan Postman

#### Test Create Category
```
POST http://localhost:8000/api/v1/categories
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Elektronik",
  "description": "Peralatan elektronik kampus"
}
```

#### Test Create Room
```
POST http://localhost:8000/api/v1/rooms
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "code": "A301",
  "name": "Ruang Kelas A301",
  "building": "Gedung A",
  "floor": 3,
  "capacity": 40
}
```

#### Test Create Asset
```
POST http://localhost:8000/api/v1/assets
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "name": "Proyektor Epson EB-X41",
  "description": "Proyektor portable untuk presentasi",
  "category_id": 1,
  "room_id": 1,
  "is_space": false,
  "status": "TERSEDIA",
  "purchase_date": "2024-01-15",
  "purchase_price": "5000000.00"
}
```

**Expected Response:**
- Status: 201 Created
- Body: Asset data dengan `code` auto-generated (AST-2026-001)

#### Test List Assets dengan Filter
```
GET http://localhost:8000/api/v1/assets?category=1&status=TERSEDIA
Authorization: Bearer {access_token}
```

#### Test Search Assets
```
GET http://localhost:8000/api/v1/assets?search=proyektor
Authorization: Bearer {access_token}
```

---

## Screenshot untuk PPT

### Slide 1: Database Schema - Aset Management
- ERD diagram: Category, Room, Asset
- Screenshot models.py dengan 3 model
- Highlight: relasi ForeignKey, auto-generate code

### Slide 2: Asset Model Features
- Screenshot Asset model dengan fields lengkap
- Highlight: is_space field (barang vs ruangan)
- Highlight: status choices (TERSEDIA, DIPINJAM, PERBAIKAN, RUSAK)
- Highlight: generate_asset_code() method

### Slide 3: Asset API Endpoints
- Screenshot Postman collection dengan CRUD endpoints
- Screenshot create asset response dengan auto-generated code
- Screenshot list assets dengan filter & search

### Slide 4: Django Admin Panel - Assets
- Screenshot admin panel dengan Category, Room, Asset
- Screenshot asset list dengan filter by status & category
- Screenshot asset detail dengan inline editing

### Slide 5: Hybrid Borrower System
- Diagram: 2 tipe borrower (Guest vs UKM)
- Screenshot LoanRequest model
- Highlight: borrower_type, guest fields, ukm_account field

### Slide 6: LoanRequest Model Features
- Screenshot LoanRequest model dengan validation logic
- Highlight: generate_loan_code() method
- Highlight: save() override dengan borrower type validation
- Highlight: date validation (return_date >= loan_date)

### Slide 7: LoanRequest Validation
- Code snippet: Borrower type integrity validation
```python
if self.borrower_type == 'GUEST':
    if not all([self.guest_nim, self.guest_name, self.guest_phone]):
        raise ValueError("Guest fields wajib diisi")
    if self.ukm_account:
        raise ValueError("ukm_account harus NULL untuk GUEST")
```

### Slide 8: Django Admin - LoanRequest
- Screenshot admin panel dengan LoanRequest
- Screenshot inline LoanItem dan ApprovalLog
- Screenshot borrower display (Guest vs UKM)

---

## Poin Penting untuk Presentasi

### Task 3: Model Aset & Lokasi

1. **3 Model Utama:**
   - Category: Kategori aset
   - Room: Lokasi/ruangan
   - Asset: Aset kampus (barang & ruangan)

2. **Asset Model Features:**
   - Field `is_space`: Membedakan barang fisik vs ruangan
   - Status: TERSEDIA, DIPINJAM, PERBAIKAN, RUSAK
   - Auto-generate code: AST-YYYY-NNN
   - Database indexes untuk performa query

3. **API Endpoints:**
   - CRUD lengkap untuk Category, Room, Asset
   - Filter & search support
   - Permission-based access (RBAC)

4. **Relasi Database:**
   - Category → Asset (One-to-Many)
   - Room → Asset (One-to-Many)
   - Asset → LoanItem (One-to-Many)

### Task 5.1: Model LoanRequest (Hybrid Borrower)

1. **Hybrid Borrower System:**
   - **GUEST**: Mahasiswa dengan NIM (tanpa akun)
   - **UKM**: Akun UKM (dengan login)
   - Fleksibilitas: Mendukung 2 tipe peminjam dalam 1 sistem

2. **Data Integrity:**
   - Validation di model level (save() override)
   - Borrower type integrity check
   - Date validation (return_date >= loan_date)
   - Auto-generate unique loan code

3. **Traceability:**
   - Semua peminjaman tercatat dengan loan_code unik
   - ApprovalLog untuk tracking approval/rejection
   - LoanItem untuk detail aset yang dipinjam

4. **Database Design:**
   - LoanRequest: Main table untuk peminjaman
   - LoanItem: Many-to-many relationship dengan Asset
   - ApprovalLog: Audit trail untuk approval workflow

---

## Files Created/Modified

### Task 3:
1. `backend/inventory/models.py` - Category, Room, Asset models
2. `backend/inventory/serializers.py` - Category, Room, Asset serializers
3. `backend/inventory/views.py` - Category, Room, Asset viewsets
4. `backend/inventory/urls.py` - Asset endpoints routing
5. `backend/inventory/admin.py` - Asset admin configuration
6. `backend/smart_inventory/settings.py` - Added django_filters
7. `backend/inventory/migrations/0002_*.py` - Database migration

### Task 5.1:
1. `backend/inventory/models.py` - LoanRequest, LoanItem, ApprovalLog models
2. `backend/inventory/admin.py` - LoanRequest admin with inlines
3. `backend/inventory/migrations/0002_*.py` - Database migration (same file)

---

## Status

✅ **Task 3 COMPLETED** - Model Aset & Lokasi siap untuk presentasi!
✅ **Task 5.1 COMPLETED** - Model LoanRequest (Hybrid Borrower) siap untuk presentasi!

## Next Steps

- ⏭️ Task 4: Checkpoint - Run migrations dan test semua endpoints
- ⏭️ Task 5.4: Buat serializers dan views untuk loan request
- ⏭️ Task 6: Implementasi approval workflow

---

## Summary untuk PPT

**Task 1-3 & 5.1 sudah selesai:**
1. ✅ Setup Django + MySQL
2. ✅ User Model + JWT Auth (4 roles)
3. ✅ Asset Management (Category, Room, Asset)
4. ✅ LoanRequest (Hybrid Borrower: Guest + UKM)

**Total Models:** 7 models
- User (RBAC)
- Category, Room, Asset (Asset Management)
- LoanRequest, LoanItem, ApprovalLog (Peminjaman)

**Total API Endpoints:** 20+ endpoints
- Authentication (3)
- User Management (5)
- Asset Management (15)

**Database:** MySQL dengan 7 tabel + indexes

**Siap untuk Demo!** 🚀
