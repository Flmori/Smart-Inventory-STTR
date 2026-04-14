# Smart-Inventory STTR - Backend API

Backend API Django REST Framework dengan database MySQL untuk sistem manajemen inventori kampus STTR.

## Fitur Utama

- **Role-Based Access Control (RBAC)**: 4 role (ADMIN, STAFF, TEKNISI, UKM)
- **Manajemen Aset**: CRUD aset kampus (barang & ruangan)
- **Peminjaman**: Hybrid borrower (Guest NIM & UKM Account)
- **Pengembalian**: Tracking kondisi dengan auto-create damage report
- **Pemeliharaan**: Damage report, maintenance task, repair budget
- **Dashboard**: Summary statistik real-time
- **Audit Trail**: Logging aktivitas penting
- **JWT Authentication**: Token-based authentication
- **WhatsApp Notifications**: Async notifications dengan Celery

## Tech Stack

- **Framework**: Django 5.2.13 + Django REST Framework 3.17.1
- **Database**: MySQL 8.0+
- **Authentication**: JWT (djangorestframework-simplejwt)
- **Task Queue**: Celery + Redis
- **Testing**: pytest + hypothesis (property-based testing)

## Prerequisites

- Python 3.10+
- MySQL 8.0+
- Redis 5.0+ (untuk Celery)

## Setup Instructions

### 1. Clone Repository

```bash
cd backend
```

### 2. Create Virtual Environment

```bash
python -m venv venv
```

### 3. Activate Virtual Environment

**Windows:**
```bash
venv\Scripts\activate
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### 4. Install Dependencies

```bash
pip install -r requirements.txt
```

### 5. Setup Environment Variables

Copy `.env.example` ke `.env` dan sesuaikan konfigurasi:

```bash
cp .env.example .env
```

Edit `.env` dan isi:
- `DB_PASSWORD`: Password MySQL Anda
- `SECRET_KEY`: Generate secret key baru untuk production
- `JWT_SECRET_KEY`: Generate JWT secret key

### 6. Create MySQL Database

Buka MySQL dan jalankan:

```sql
CREATE DATABASE smart_inventory_sttr CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 7. Run Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 8. Create Superuser

```bash
python manage.py createsuperuser
```

### 9. Run Development Server

```bash
python manage.py runserver
```

API akan berjalan di: `http://localhost:8000`

## Project Structure

```
backend/
├── smart_inventory/          # Django project settings
│   ├── settings.py          # Konfigurasi utama
│   ├── urls.py              # URL routing utama
│   └── wsgi.py              # WSGI application
├── inventory/               # Main application
│   ├── models.py            # Database models (14 tabel)
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API views
│   ├── urls.py              # API endpoints
│   ├── permissions.py       # Custom permissions (RBAC)
│   ├── services.py          # Business logic
│   └── utils.py             # Utility functions
├── media/                   # Uploaded files (QR codes, photos)
├── staticfiles/             # Static files (production)
├── requirements.txt         # Python dependencies
├── .env                     # Environment variables
└── manage.py                # Django management script
```

## Database Schema

14 Tabel:
1. **User** - Custom user dengan role (ADMIN, STAFF, TEKNISI, UKM)
2. **Category** - Kategori aset
3. **Room** - Lokasi/ruangan
4. **Asset** - Aset kampus (barang & ruangan)
5. **LoanRequest** - Pengajuan peminjaman
6. **LoanItem** - Item yang dipinjam
7. **ApprovalLog** - Log approval/rejection
8. **ReturnLog** - Log pengembalian
9. **DamageReport** - Laporan kerusakan
10. **MaintenanceTask** - Task pemeliharaan
11. **RepairBudget** - Anggaran perbaikan
12. **RepairLog** - Riwayat perbaikan
13. **AuditLog** - Audit trail
14. **BlacklistedToken** - JWT token blacklist

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

### Dashboard
- `GET /api/v1/dashboard/summary` - Dashboard summary

### User Management
- `POST /api/v1/users` - Create user (ADMIN only)
- `GET /api/v1/users` - List users (ADMIN only)
- `DELETE /api/v1/users/{id}` - Delete user (ADMIN only)

### Assets
- `GET /api/v1/assets` - List assets
- `GET /api/v1/assets/{id}` - Get asset detail
- `POST /api/v1/assets` - Create asset
- `PUT /api/v1/assets/{id}` - Update asset
- `DELETE /api/v1/assets/{id}` - Delete asset

### Loans
- `POST /api/v1/loans/request` - Create loan request
- `GET /api/v1/loans/approval-queue` - Get approval queue
- `POST /api/v1/loans/{id}/approve` - Approve loan
- `POST /api/v1/loans/{id}/reject` - Reject loan

### Returns
- `GET /api/v1/returns/search` - Search loan by ID/NIM
- `POST /api/v1/returns/process` - Process return

### Damage Reports
- `POST /api/v1/damage-reports` - Create damage report
- `GET /api/v1/damage-reports` - List damage reports

### Maintenance
- `GET /api/v1/maintenance/tasks` - List maintenance tasks
- `POST /api/v1/maintenance/tasks/{id}/start` - Start task
- `POST /api/v1/maintenance/tasks/{id}/complete` - Complete task

### Audit Logs
- `GET /api/v1/audit-logs` - List audit logs (ADMIN only)

## Testing

Run tests:

```bash
pytest
```

Run with coverage:

```bash
pytest --cov=inventory --cov-report=html
```

## Development

### Run Celery Worker (untuk WhatsApp notifications)

```bash
celery -A smart_inventory worker -l info
```

### Run Celery Beat (untuk scheduled tasks)

```bash
celery -A smart_inventory beat -l info
```

### Code Formatting

```bash
black .
isort .
flake8
```

## Production Deployment

1. Set `DEBUG=False` di `.env`
2. Generate secure `SECRET_KEY` dan `JWT_SECRET_KEY`
3. Configure proper `ALLOWED_HOSTS`
4. Setup MySQL dengan user dedicated (bukan root)
5. Setup Redis untuk Celery
6. Collect static files: `python manage.py collectstatic`
7. Run with Gunicorn: `gunicorn smart_inventory.wsgi:application`
8. Setup Nginx sebagai reverse proxy
9. Setup SSL certificate (Let's Encrypt)

## License

Proprietary - STTR (Sekolah Tinggi Teknologi Riau)

## Contact

Untuk pertanyaan atau support, hubungi tim IT STTR.
