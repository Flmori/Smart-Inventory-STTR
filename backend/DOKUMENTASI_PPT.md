V# Dokumentasi untuk Presentasi PPT - Smart-Inventory STTR

## Task 1: Setup Project Django dan Koneksi MySQL ✅

### Struktur Folder yang Sudah Dibuat

```
backend/
├── smart_inventory/              # Django Project
│   ├── __init__.py
│   ├── settings.py              # ✅ Konfigurasi lengkap (MySQL, JWT, CORS, Celery)
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
│
├── inventory/                    # Main Application
│   ├── migrations/              # ✅ Folder untuk database migrations
│   ├── management/              # ✅ Custom management commands
│   │   └── commands/
│   ├── tests/                   # ✅ Folder untuk unit tests
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py               # Akan diisi di Task 2 & 3
│   ├── views.py                # Akan diisi untuk API endpoints
│   ├── serializers.py          # Akan diisi untuk DRF serializers
│   ├── urls.py                 # Akan diisi untuk routing
│   ├── permissions.py          # Akan diisi untuk RBAC
│   ├── services.py             # Akan diisi untuk business logic
│   └── utils.py                # ✅ Custom exception handler
│
├── media/                       # Untuk upload files (QR codes, photos)
├── staticfiles/                 # Untuk static files production
├── venv/                        # Virtual environment Python
├── requirements.txt             # ✅ Dependencies lengkap
├── .env                         # ✅ Environment variables
├── .env.example                 # ✅ Template environment variables
├── .gitignore                   # ✅ Git ignore rules
├── create_database.sql          # ✅ SQL script untuk create database
├── setup_database.bat           # ✅ Script otomatis setup database
├── manage.py                    # ✅ Django management script
└── README.md                    # ✅ Dokumentasi lengkap
```

### Konfigurasi MySQL di settings.py

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'smart_inventory_sttr',
        'USER': 'root',
        'PASSWORD': '',  # Diambil dari .env
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}
```

### Fitur yang Sudah Dikonfigurasi

1. **Django REST Framework** ✅
   - Authentication: JWT (djangorestframework-simplejwt)
   - Pagination: 20 items per page
   - Filter & Search support
   - Custom exception handler

2. **JWT Authentication** ✅
   - Access token lifetime: 1 jam
   - Refresh token lifetime: 7 hari
   - Token rotation & blacklist

3. **CORS Configuration** ✅
   - Allow frontend (localhost:5173, localhost:3000)
   - Allow credentials

4. **Celery Configuration** ✅
   - Redis sebagai message broker
   - Untuk WhatsApp notifications (async)

5. **Internationalization** ✅
   - Language: Bahasa Indonesia (id-id)
   - Timezone: Asia/Jakarta

### Cara Menjalankan Setup

1. **Install Dependencies:**
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. **Setup Database:**
   ```bash
   # Jalankan script otomatis
   setup_database.bat
   
   # Atau manual di MySQL:
   mysql -u root -p < create_database.sql
   ```

3. **Edit .env:**
   ```
   DB_PASSWORD=your_mysql_password
   ```

4. **Run Migrations (setelah Task 2 & 3 selesai):**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create Superuser:**
   ```bash
   python manage.py createsuperuser
   ```

6. **Run Server:**
   ```bash
   python manage.py runserver
   ```

### Screenshot untuk PPT

**Slide 1: Struktur Project**
- Screenshot folder structure di VS Code
- Highlight: smart_inventory/, inventory/, requirements.txt

**Slide 2: Konfigurasi Database**
- Screenshot settings.py bagian DATABASES
- Screenshot .env file
- Screenshot MySQL Workbench dengan database smart_inventory_sttr

**Slide 3: Dependencies**
- Screenshot requirements.txt
- Highlight: Django, DRF, mysqlclient, JWT, Celery

**Slide 4: Konfigurasi REST Framework**
- Screenshot settings.py bagian REST_FRAMEWORK
- Screenshot settings.py bagian SIMPLE_JWT

---

## Task 2: Model User & Authentication (RBAC)

### Yang Akan Dibuat

1. **Custom User Model** dengan 4 role:
   - ADMIN: Full access
   - STAFF: Manage peminjaman & pengembalian
   - TEKNISI: Manage maintenance tasks
   - UKM: Create loan request, view own loans

2. **JWT Authentication Endpoints:**
   - POST /api/v1/auth/login
   - POST /api/v1/auth/refresh
   - POST /api/v1/auth/logout

3. **Permission Classes:**
   - IsAdmin
   - IsStaffOrAdmin
   - IsTechnician
   - IsUKM

### Screenshot untuk PPT

**Slide 5: User Model dengan RBAC**
- Screenshot models.py dengan User model
- Highlight: role field dengan ROLE_CHOICES
- Diagram: 4 role dan permission matrix

**Slide 6: JWT Authentication**
- Screenshot login endpoint code
- Screenshot Postman/Thunder Client test login
- Screenshot JWT token response

---

## Task 3: Model Aset & Lokasi

### Yang Akan Dibuat

1. **Model Category**
   - Kategori aset (Elektronik, Furniture, Alat Lab, dll)

2. **Model Room**
   - Lokasi/ruangan tempat aset berada
   - Fields: code, name, building, floor, capacity

3. **Model Asset**
   - Aset kampus (barang & ruangan)
   - Field is_space untuk membedakan barang vs ruangan
   - Status: TERSEDIA, DIPINJAM, PERBAIKAN, RUSAK
   - Auto-generate code: AST-YYYY-NNN

### Screenshot untuk PPT

**Slide 7: Database Schema - Aset**
- ERD diagram: Category, Room, Asset
- Screenshot models.py dengan 3 model
- Highlight: relasi ForeignKey

**Slide 8: Asset Management**
- Screenshot admin panel dengan data aset
- Screenshot API endpoint GET /api/v1/assets
- Screenshot response JSON dengan nested Category & Room

---

## Task 5.1: Model LoanRequest (Hybrid Borrower)

### Yang Akan Dibuat

1. **Model LoanRequest**
   - Mendukung 2 tipe borrower:
     - GUEST: Mahasiswa dengan NIM (tanpa akun)
     - UKM: Akun UKM (dengan login)
   - Auto-generate code: PJM-YYYY-NNN
   - Status: PENDING, APPROVED, REJECTED, RETURNED

2. **Model LoanItem**
   - Item aset yang dipinjam
   - Relasi many-to-many antara LoanRequest dan Asset

### Screenshot untuk PPT

**Slide 9: Hybrid Borrower System**
- Diagram: 2 tipe borrower (Guest vs UKM)
- Screenshot models.py dengan LoanRequest
- Highlight: borrower_type, guest_nim, ukm_account

**Slide 10: Loan Request Flow**
- Sequence diagram: Guest create loan → Staff approve → Asset status update
- Screenshot API endpoint POST /api/v1/loans/request
- Screenshot request body untuk Guest vs UKM

---

## Checklist untuk Presentasi

### Persiapan Demo

- [ ] MySQL sudah running
- [ ] Database smart_inventory_sttr sudah dibuat
- [ ] Virtual environment sudah aktif
- [ ] Dependencies sudah terinstall
- [ ] .env sudah dikonfigurasi dengan benar
- [ ] Migrations sudah dijalankan (setelah Task 2 & 3)
- [ ] Superuser sudah dibuat
- [ ] Server Django bisa running tanpa error
- [ ] Postman/Thunder Client sudah siap untuk test API

### Poin Penting untuk Dijelaskan

1. **Arsitektur 3-Layer:**
   - Presentation Layer: REST API (Django REST Framework)
   - Business Logic Layer: Services & Serializers
   - Data Layer: Models & MySQL Database

2. **Role-Based Access Control (RBAC):**
   - 4 role dengan permission berbeda
   - JWT token menyimpan role user
   - Permission classes di setiap endpoint

3. **Hybrid Borrower System:**
   - Fleksibilitas: Guest (tanpa akun) & UKM (dengan akun)
   - Data integrity: Validation borrower_type
   - Traceability: Semua peminjaman tercatat

4. **Database Design:**
   - 14 tabel dengan relasi yang jelas
   - Foreign Key constraints
   - Auto-generated unique codes
   - Audit trail untuk compliance

5. **API Design:**
   - RESTful principles
   - Consistent error response format
   - Pagination & filtering
   - JWT authentication

### Tips Presentasi

1. **Mulai dengan Big Picture:**
   - Tunjukkan diagram arsitektur sistem
   - Jelaskan flow dari frontend → API → database

2. **Demo Live Coding (Optional):**
   - Buat 1 endpoint sederhana dari awal
   - Tunjukkan bagaimana model → serializer → view → URL

3. **Tunjukkan Hasil Nyata:**
   - Database dengan data sample
   - API response di Postman
   - Admin panel Django

4. **Highlight Fitur Unggulan:**
   - Auto-create damage report saat return rusak
   - Hybrid borrower system
   - RBAC dengan 4 role
   - Audit trail lengkap

5. **Siapkan Backup Plan:**
   - Screenshot semua hasil jika demo gagal
   - Video recording demo sebagai backup
   - Dokumentasi lengkap di README.md

---

## Kontak & Support

Jika ada pertanyaan saat presentasi, siapkan jawaban untuk:
- Kenapa pakai Django REST Framework? (Mature, secure, scalable)
- Kenapa pakai MySQL? (Relational data, ACID compliance)
- Kenapa pakai JWT? (Stateless, scalable, secure)
- Kenapa pakai Celery? (Async tasks, WhatsApp notifications)
- Bagaimana handle concurrent access? (Database transactions, locking)
- Bagaimana security? (JWT, RBAC, input validation, SQL injection prevention)
