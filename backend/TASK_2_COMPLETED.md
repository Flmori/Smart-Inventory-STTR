# Task 2: Model User & Authentication - COMPLETED ✅

## Yang Sudah Dibuat

### 1. Custom User Model dengan RBAC (Role-Based Access Control)

**File:** `backend/inventory/models.py`

**Features:**
- Extends Django `AbstractUser` untuk autentikasi built-in
- 4 Role dengan permission berbeda:
  - **ADMIN**: Full access ke semua fitur
  - **STAFF**: Manage peminjaman, pengembalian, approval
  - **TEKNISI**: Manage maintenance tasks, repair budget
  - **UKM**: Create loan request, view own loans

**Fields:**
```python
- id (AutoField, PK)
- username (CharField, unique)
- email (EmailField, unique)
- password (CharField, hashed)
- first_name (CharField)
- last_name (CharField)
- role (CharField, choices=ROLE_CHOICES)  # ADMIN, STAFF, TEKNISI, UKM
- phone_number (CharField, nullable)
- is_active (BooleanField)
- created_at (DateTimeField, auto_now_add)
- updated_at (DateTimeField, auto_now)
```

**Helper Methods:**
- `get_full_name()`: Return full name
- `is_admin`: Property untuk check role ADMIN
- `is_staff_role`: Property untuk check role STAFF
- `is_teknisi`: Property untuk check role TEKNISI
- `is_ukm`: Property untuk check role UKM

### 2. JWT Authentication Endpoints

**File:** `backend/inventory/views.py`

#### a. Login Endpoint
```
POST /api/v1/auth/login
```

**Request Body:**
```json
{
  "username": "admin_user",
  "password": "password123"
}
```

**Response (200 OK):**
```json
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
```

**Response (401 Unauthorized):**
```json
{
  "error": "AuthenticationFailed",
  "message": "Username atau password salah"
}
```

#### b. Refresh Token Endpoint
```
POST /api/v1/auth/refresh
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### c. Logout Endpoint
```
POST /api/v1/auth/logout
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Response (200 OK):**
```json
{
  "detail": "Logout berhasil"
}
```

### 3. Permission Classes untuk RBAC

**File:** `backend/inventory/permissions.py`

**Permission Classes:**
1. **IsAdmin**: Hanya ADMIN yang bisa akses
2. **IsStaffOrAdmin**: STAFF atau ADMIN yang bisa akses
3. **IsTechnician**: TEKNISI, STAFF, atau ADMIN yang bisa akses
4. **IsUKM**: Hanya UKM yang bisa akses
5. **IsUKMOrStaffOrAdmin**: UKM, STAFF, atau ADMIN yang bisa akses
6. **IsOwnerOrStaffOrAdmin**: Object-level permission (user hanya bisa akses data miliknya)

### 4. User Management Endpoints (ADMIN only)

**File:** `backend/inventory/views.py` - `UserViewSet`

#### a. List Users
```
GET /api/v1/users
GET /api/v1/users?role=UKM  # Filter by role
```

**Response (200 OK):**
```json
{
  "count": 2,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 5,
      "username": "ukm_musik",
      "email": "ukm.musik@sttr.ac.id",
      "first_name": "UKM",
      "last_name": "Musik STTR",
      "full_name": "UKM Musik STTR",
      "role": "UKM",
      "phone_number": "081234567890",
      "is_active": true,
      "created_at": "2026-04-13T10:00:00Z",
      "updated_at": "2026-04-13T10:00:00Z"
    }
  ]
}
```

#### b. Create User
```
POST /api/v1/users
```

**Request Body:**
```json
{
  "username": "ukm_musik",
  "email": "ukm.musik@sttr.ac.id",
  "first_name": "UKM",
  "last_name": "Musik STTR",
  "role": "UKM",
  "phone_number": "081234567890"
}
```

**Response (201 Created):**
```json
{
  "id": 5,
  "username": "ukm_musik",
  "email": "ukm.musik@sttr.ac.id",
  "first_name": "UKM",
  "last_name": "Musik STTR",
  "full_name": "UKM Musik STTR",
  "role": "UKM",
  "phone_number": "081234567890",
  "is_active": true,
  "created_at": "2026-04-13T10:00:00Z",
  "updated_at": "2026-04-13T10:00:00Z",
  "credentials": {
    "username": "ukm_musik",
    "password": "aB3dE5fG7hJ9"  # Auto-generated 12 karakter
  }
}
```

**Note:** Password auto-generated 12 karakter (alphanumeric) dan hanya muncul sekali saat create.

#### c. Delete User
```
DELETE /api/v1/users/{id}
```

**Response (204 No Content)**

### 5. Serializers

**File:** `backend/inventory/serializers.py`

1. **CustomTokenObtainPairSerializer**: Custom JWT serializer dengan user data
2. **UserSerializer**: Serializer untuk User model (read)
3. **UserCreateSerializer**: Serializer untuk create user dengan auto-generated password

### 6. URL Routing

**File:** `backend/inventory/urls.py`

**Authentication Endpoints:**
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout

**User Management Endpoints (ADMIN only):**
- `GET /api/v1/users` - List users
- `POST /api/v1/users` - Create user
- `GET /api/v1/users/{id}` - Get user detail
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user

### 7. Django Admin Panel

**File:** `backend/inventory/admin.py`

- Custom User Admin dengan role field
- List display: username, email, name, role, is_active, created_at
- List filter: role, is_active, is_staff, is_superuser
- Search: username, email, name, phone_number

### 8. Database Migration

**File:** `backend/inventory/migrations/0001_initial.py`

Migration file sudah dibuat untuk User model.

## Cara Testing

### 1. Setup Database (jika belum)

```bash
# Jalankan script setup database
setup_database.bat

# Atau manual di MySQL:
mysql -u root -p < create_database.sql
```

### 2. Edit .env

```
DB_PASSWORD=your_mysql_password
```

### 3. Run Migrations

```bash
python manage.py migrate
```

### 4. Create Superuser

```bash
python manage.py createsuperuser
# Username: admin
# Email: admin@sttr.ac.id
# Password: admin123
# Role: ADMIN
```

### 5. Run Server

```bash
python manage.py runserver
```

Server akan berjalan di: `http://localhost:8000`

### 6. Test Endpoints dengan Postman/Thunder Client

#### Test Login
```
POST http://localhost:8000/api/v1/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**Expected Response:**
- Status: 200 OK
- Body: access token, refresh token, user data

#### Test Create User (ADMIN only)
```
POST http://localhost:8000/api/v1/users
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "username": "ukm_musik",
  "email": "ukm.musik@sttr.ac.id",
  "first_name": "UKM",
  "last_name": "Musik STTR",
  "role": "UKM",
  "phone_number": "081234567890"
}
```

**Expected Response:**
- Status: 201 Created
- Body: user data + credentials (auto-generated password)

#### Test List Users
```
GET http://localhost:8000/api/v1/users
Authorization: Bearer {access_token}
```

**Expected Response:**
- Status: 200 OK
- Body: paginated list of users

#### Test Logout
```
POST http://localhost:8000/api/v1/auth/logout
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "refresh": "{refresh_token}"
}
```

**Expected Response:**
- Status: 200 OK
- Body: {"detail": "Logout berhasil"}

### 7. Test Django Admin Panel

1. Buka: `http://localhost:8000/admin`
2. Login dengan superuser credentials
3. Lihat User model di admin panel
4. Test CRUD operations

## Screenshot untuk PPT

### Slide 1: User Model dengan RBAC
- Screenshot `models.py` dengan User model
- Highlight: `ROLE_CHOICES` dengan 4 role
- Diagram: Permission matrix (role vs endpoints)

### Slide 2: JWT Authentication Flow
- Sequence diagram: Login → Get tokens → Access protected endpoint → Refresh token
- Screenshot login endpoint code
- Screenshot Postman test login dengan response

### Slide 3: Permission Classes
- Screenshot `permissions.py` dengan 6 permission classes
- Tabel: Permission matrix

| Endpoint | ADMIN | STAFF | TEKNISI | UKM | Guest |
|----------|-------|-------|---------|-----|-------|
| Dashboard | ✓ | ✓ | ✓ | ✗ | ✗ |
| Create User | ✓ | ✗ | ✗ | ✗ | ✗ |
| List Users | ✓ | ✗ | ✗ | ✗ | ✗ |
| Create Loan (Guest) | ✗ | ✗ | ✗ | ✗ | ✓ |
| Create Loan (UKM) | ✗ | ✗ | ✗ | ✓ | ✗ |
| Approval Queue | ✓ | ✓ | ✗ | ✗ | ✗ |
| Maintenance Tasks | ✓ | ✓ | ✓ | ✗ | ✗ |

### Slide 4: User Management Endpoints
- Screenshot Postman collection dengan 5 endpoints
- Screenshot create user response dengan auto-generated password
- Screenshot Django admin panel dengan user list

## Poin Penting untuk Presentasi

1. **Role-Based Access Control (RBAC)**
   - 4 role dengan permission berbeda
   - Permission classes untuk setiap endpoint
   - JWT token menyimpan role user

2. **JWT Authentication**
   - Stateless authentication (tidak perlu session)
   - Access token (1 jam) + Refresh token (7 hari)
   - Token blacklist untuk logout

3. **Auto-Generated Password**
   - Password 12 karakter (alphanumeric)
   - Hanya muncul sekali saat create user
   - Secure & random

4. **Custom Exception Handler**
   - Format error response yang konsisten
   - Error code + message dalam Bahasa Indonesia
   - Details untuk validation errors

5. **Django Admin Panel**
   - Built-in admin interface
   - Custom User Admin dengan role field
   - Easy CRUD operations

## Next Steps

- ✅ Task 1: Setup project Django dan konfigurasi database
- ✅ Task 2: Model User & Authentication
- ⏭️ Task 3: Model Aset & Lokasi (Category, Room, Asset)
- ⏭️ Task 5.1: Model LoanRequest (Hybrid Borrower)

## Files Created/Modified

1. `backend/inventory/models.py` - User model
2. `backend/inventory/serializers.py` - User serializers
3. `backend/inventory/views.py` - Authentication & User management views
4. `backend/inventory/permissions.py` - Permission classes
5. `backend/inventory/urls.py` - URL routing
6. `backend/inventory/admin.py` - Django admin configuration
7. `backend/smart_inventory/urls.py` - Main URL configuration
8. `backend/inventory/migrations/0001_initial.py` - Database migration

## Status

✅ **COMPLETED** - Task 2 selesai dan siap untuk presentasi PPT!
