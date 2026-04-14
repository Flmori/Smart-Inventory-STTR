# Rencana Implementasi: Backend API Django REST Framework untuk Smart-Inventory STTR

## Ringkasan

Backend API Django REST Framework dengan database MySQL untuk sistem manajemen inventori kampus. Sistem mengelola 14 tabel database, 4 role user (ADMIN, STAFF, TEKNISI, UKM), dan fitur peminjaman, pengembalian, pemeliharaan aset dengan approval workflow.

## Tasks

- [x] 1. Setup project Django dan konfigurasi database
  - Buat Django project dengan nama `smart_inventory`
  - Konfigurasi MySQL database connection di `settings.py`
  - Setup environment variables dengan `python-dotenv`
  - Install dependencies dari `requirements.txt`
  - Konfigurasi Django REST Framework dan JWT authentication
  - _Requirements: 1.1, 1.2, 1.3, 1.4_

- [x] 2. Implementasi model User dan authentication
  - [x] 2.1 Buat custom User model dengan role field
    - Extend `AbstractUser` dengan field `role`, `phone_number`
    - Tambahkan `ROLE_CHOICES` (ADMIN, STAFF, TEKNISI, UKM)
    - _Requirements: 1.1, 2.1, 3.1, 23_
  
  - [ ]* 2.2 Write property test untuk User model
    - **Property 23: User Role Valid Values**
    - **Validates: Requirements 3.3**
  
  - [x] 2.3 Implementasi JWT authentication endpoints
    - Buat endpoint `POST /auth/login` dengan JWT token generation
    - Buat endpoint `POST /auth/refresh` untuk refresh token
    - Buat endpoint `POST /auth/logout` dengan token blacklist
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [ ]* 2.4 Write unit tests untuk authentication flow
    - Test login dengan kredensial valid dan invalid
    - Test refresh token dan logout
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_

- [x] 3. Implementasi model Category, Room, dan Asset
  - [x] 3.1 Buat model Category dan Room
    - Implementasi model `Category` dengan field `name`, `description`
    - Implementasi model `Room` dengan field `code`, `name`, `building`, `floor`, `capacity`
    - _Requirements: 4.1, 4.2_
  
  - [x] 3.2 Buat model Asset dengan relasi ke Category dan Room
    - Implementasi model `Asset` dengan semua field sesuai design
    - Tambahkan field `code`, `name`, `category`, `room`, `is_space`, `status`
    - Implementasi method `generate_asset_code()` dengan format AST-YYYY-NNN
    - _Requirements: 4.1, 4.2, 4.4, 4.5, 15.4_
  
  - [ ]* 3.3 Write property tests untuk Asset model
    - **Property 4: Asset Status Valid Values**
    - **Property 25: Asset Code Uniqueness**
    - **Property 34: Asset Code Format**
    - **Validates: Requirements 4.4, 4.5, 15.4, 15.5**
  
  - [x] 3.4 Buat serializers dan viewsets untuk Asset management
    - Implementasi `AssetSerializer` dengan nested Category dan Room
    - Implementasi `AssetViewSet` dengan filter, search, pagination
    - _Requirements: 4.1, 4.2, 4.3, 19.1, 19.2, 19.3, 19.4, 19.5, 20.1, 20.2, 20.3_
  
  - [ ]* 3.5 Write unit tests untuk Asset endpoints
    - Test list assets dengan filter dan search
    - Test get asset detail
    - _Requirements: 4.1, 4.2, 4.3_

- [ ] 4. Checkpoint - Pastikan semua tests pass
  - Pastikan semua tests pass, tanyakan user jika ada pertanyaan.

- [-] 5. Implementasi model LoanRequest dan LoanItem
  - [x] 5.1 Buat model LoanRequest dengan borrower type
    - Implementasi model `LoanRequest` dengan field `borrower_type`, `guest_nim`, `guest_name`, `guest_phone`, `ukm_account`
    - Implementasi method `generate_loan_code()` dengan format PJM-YYYY-NNN
    - Tambahkan validation untuk borrower type integrity
    - _Requirements: 5.1, 5.2, 15.1, 16.1, 16.2_
  
  - [x] 5.2 Buat model LoanItem untuk relasi many-to-many
    - Implementasi model `LoanItem` dengan field `loan_request`, `asset`, `quantity`, `notes`
    - _Requirements: 5.1_
  
  - [ ]* 5.3 Write property tests untuk LoanRequest model
    - **Property 1: Loan Request Borrower Type Integrity (GUEST)**
    - **Property 2: Loan Request Borrower Type Integrity (UKM)**
    - **Property 3: Loan Date Validation**
    - **Property 24: Loan Code Uniqueness**
    - **Property 31: Loan Code Format**
    - **Property 35: Submitted Loan Has Approval Log**
    - **Validates: Requirements 5.1, 5.3, 15.1, 15.5, 16.1, 16.2**
  
  - [ ] 5.4 Buat serializers dan views untuk loan request
    - Implementasi `LoanRequestSerializer` dengan nested LoanItem
    - Implementasi view `POST /loans/request` untuk Guest dan UKM
    - Tambahkan validation untuk asset availability
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3, 6.4_
  
  - [ ]* 5.5 Write unit tests untuk loan request creation
    - Test create loan request sebagai Guest
    - Test create loan request sebagai UKM
    - Test validation errors
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 6.1, 6.2, 6.3_

- [ ] 6. Implementasi ApprovalLog dan approval workflow
  - [ ] 6.1 Buat model ApprovalLog
    - Implementasi model `ApprovalLog` dengan field `loan_request`, `action`, `approver`, `notes`
    - Tambahkan `ACTION_CHOICES` (SUBMITTED, APPROVED, REJECTED)
    - _Requirements: 7.5_
  
  - [ ] 6.2 Implementasi service `approve_loan_request()`
    - Implementasi algoritma approval sesuai design document
    - Update status LoanRequest menjadi APPROVED
    - Update status Asset menjadi DIPINJAM
    - Buat ApprovalLog dengan action APPROVED
    - Buat AuditLog untuk tracking
    - _Requirements: 7.1, 7.2, 7.5, 7.6_
  
  - [ ] 6.3 Implementasi service `reject_loan_request()`
    - Implementasi algoritma rejection sesuai design document
    - Update status LoanRequest menjadi REJECTED
    - Buat ApprovalLog dengan action REJECTED
    - Validasi notes wajib diisi
    - _Requirements: 7.3, 7.4, 7.5, 7.6_
  
  - [ ]* 6.4 Write property tests untuk approval workflow
    - **Property 5: Approved Loan Asset Status**
    - **Property 6: Borrowed Asset Has Approved Loan**
    - **Property 17: Approved Loan Has Approval Log**
    - **Property 18: Rejected Loan Has Approval Log**
    - **Property 19: Approval Log Has Valid Approver**
    - **Property 20: Approved Loan Has Audit Log**
    - **Validates: Requirements 7.1, 7.5, 7.6, 16.3**
  
  - [ ] 6.4 Buat endpoints untuk approval queue
    - Implementasi `GET /loans/approval-queue` dengan filter status
    - Implementasi `POST /loans/{id}/approve`
    - Implementasi `POST /loans/{id}/reject`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_
  
  - [ ]* 6.5 Write unit tests untuk approval endpoints
    - Test approve loan dengan aset tersedia
    - Test approve loan dengan aset tidak tersedia
    - Test reject loan dengan dan tanpa notes
    - _Requirements: 7.1, 7.2, 7.3, 7.4_

- [ ] 7. Checkpoint - Pastikan approval workflow berfungsi
  - Pastikan semua tests pass, tanyakan user jika ada pertanyaan.

- [ ] 8. Implementasi model ReturnLog dan return processing
  - [ ] 8.1 Buat model ReturnLog
    - Implementasi model `ReturnLog` dengan field `loan_request`, `return_date`, `condition`, `completeness_notes`, `damage_notes`, `received_by`
    - Tambahkan `CONDITION_CHOICES` (BAIK, RUSAK)
    - _Requirements: 8.1, 8.2, 8.3, 9.1_
  
  - [ ] 8.2 Implementasi service `process_return()` untuk kondisi BAIK
    - Implementasi algoritma return sesuai design document
    - Buat ReturnLog dengan condition BAIK
    - Update status LoanRequest menjadi RETURNED
    - Update status Asset menjadi TERSEDIA
    - Buat AuditLog untuk tracking
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [ ]* 8.3 Write property tests untuk return kondisi BAIK
    - **Property 7: Return Log Uniqueness**
    - **Property 8: Returned Loan Status**
    - **Property 11: Good Condition Return Asset Status**
    - **Property 21: Return Has Audit Log**
    - **Validates: Requirements 8.1, 8.2, 8.3, 8.5, 16.4**
  
  - [ ] 8.4 Buat endpoints untuk return processing
    - Implementasi `GET /returns/search` dengan query loan_id atau nim
    - Implementasi `POST /returns/process` untuk proses pengembalian
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 20.4_
  
  - [ ]* 8.5 Write unit tests untuk return kondisi BAIK
    - Test process return dengan kondisi BAIK
    - Test validation errors
    - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [ ] 9. Implementasi auto-create damage report untuk return kondisi RUSAK
  - [ ] 9.1 Buat model DamageReport
    - Implementasi model `DamageReport` dengan field `report_code`, `asset`, `reporter_name`, `reporter_phone`, `description`, `photo_url`, `source`
    - Implementasi method `generate_damage_report_code()` dengan format DMG-YYYY-NNN
    - Tambahkan `SOURCE_CHOICES` (MANUAL, AUTO_RETURN)
    - _Requirements: 9.2, 10.1, 10.2, 10.3, 10.4, 15.2_
  
  - [ ] 9.2 Implementasi model MaintenanceTask
    - Implementasi model `MaintenanceTask` dengan field `task_code`, `asset`, `damage_report`, `title`, `description`, `status`, `assigned_to`, `priority`
    - Implementasi method `generate_maintenance_task_code()` dengan format MNT-YYYY-NNN
    - Tambahkan `TASK_STATUS_CHOICES` (MENUNGGU, PROSES, SELESAI)
    - _Requirements: 9.4, 11.1, 11.2, 11.3, 11.4, 11.5, 15.3_
  
  - [ ] 9.3 Extend service `process_return()` untuk kondisi RUSAK
    - Tambahkan logic auto-create DamageReport dengan source AUTO_RETURN
    - Tambahkan logic auto-create MaintenanceTask dengan status MENUNGGU
    - Update status Asset menjadi PERBAIKAN
    - Buat AuditLog untuk damage report auto-creation
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 9.4 Write property tests untuk return kondisi RUSAK
    - **Property 9: Damaged Return Creates Damage Report**
    - **Property 10: Damaged Return Asset Status**
    - **Property 12: Damaged Return Creates Maintenance Task**
    - **Property 13: Maintenance Task Status Valid Values**
    - **Property 26: Damage Report Code Uniqueness**
    - **Property 27: Maintenance Task Code Uniqueness**
    - **Property 32: Damage Report Code Format**
    - **Property 33: Maintenance Task Code Format**
    - **Property 36: Auto-Created Damage Report Has Audit Log**
    - **Validates: Requirements 9.1, 9.2, 9.3, 9.4, 9.5, 10.4, 11.4, 11.5, 15.2, 15.3, 15.5**
  
  - [ ]* 9.5 Write unit tests untuk return kondisi RUSAK
    - Test process return dengan kondisi RUSAK
    - Test auto-create damage report dan maintenance task
    - Test asset status update ke PERBAIKAN
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 10. Checkpoint - Pastikan return workflow lengkap
  - Pastikan semua tests pass, tanyakan user jika ada pertanyaan.

- [ ] 11. Implementasi damage report manual dan maintenance task management
  - [ ] 11.1 Buat endpoints untuk damage report manual
    - Implementasi `POST /damage-reports` untuk create manual damage report
    - Implementasi `GET /damage-reports` dengan filter dan pagination
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [ ]* 11.2 Write unit tests untuk damage report endpoints
    - Test create damage report manual
    - Test list damage reports dengan filter
    - _Requirements: 10.1, 10.2, 10.3, 10.5_
  
  - [ ] 11.3 Buat endpoints untuk maintenance task management
    - Implementasi `GET /maintenance/tasks` dengan filter status
    - Implementasi `POST /maintenance/tasks/{id}/start` untuk start task
    - _Requirements: 11.1, 11.2, 11.3, 11.5, 20.5_
  
  - [ ]* 11.4 Write unit tests untuk maintenance task endpoints
    - Test list maintenance tasks dengan filter
    - Test start maintenance task
    - Test validation errors
    - _Requirements: 11.1, 11.2, 11.3_

- [ ] 12. Implementasi RepairBudget dan RepairLog
  - [ ] 12.1 Buat model RepairBudget
    - Implementasi model `RepairBudget` dengan field `maintenance_task`, `sparepart_details` (JSONField), `sparepart_total`, `labor_cost`, `other_cost`, `total_cost`
    - Tambahkan validation untuk budget calculation
    - _Requirements: 12.1, 12.4, 12.5_
  
  - [ ] 12.2 Buat model RepairLog
    - Implementasi model `RepairLog` dengan field `maintenance_task`, `asset`, `technician`, `work_description`, `result`, `completion_date`, `total_cost`
    - Tambahkan `RESULT_CHOICES` (SUCCESS, PARTIAL, FAILED)
    - _Requirements: 12.2_
  
  - [ ] 12.3 Implementasi endpoint complete maintenance task
    - Implementasi `POST /maintenance/tasks/{id}/complete` dengan budget data
    - Update status MaintenanceTask menjadi SELESAI
    - Buat RepairBudget dan RepairLog
    - Update status Asset menjadi TERSEDIA jika result SUCCESS
    - Buat AuditLog untuk tracking
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_
  
  - [ ]* 12.4 Write property tests untuk repair budget
    - **Property 14: Completed Task Has Repair Budget**
    - **Property 15: Completed Task Has Repair Log**
    - **Property 16: Successful Repair Asset Status**
    - **Property 28: Repair Budget Total Cost Calculation**
    - **Property 29: Repair Budget Sparepart Total Calculation**
    - **Property 30: Sparepart Item Total Calculation**
    - **Property 22: Completed Maintenance Has Audit Log**
    - **Validates: Requirements 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 16.5**
  
  - [ ]* 12.5 Write unit tests untuk complete maintenance task
    - Test complete task dengan budget valid
    - Test budget calculation validation
    - Test asset status update
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_

- [ ] 13. Checkpoint - Pastikan maintenance workflow lengkap
  - Pastikan semua tests pass, tanyakan user jika ada pertanyaan.

- [ ] 14. Implementasi User management dan role-based permissions
  - [ ] 14.1 Buat permission classes untuk RBAC
    - Implementasi `IsAdmin`, `IsStaffOrAdmin`, `IsTechnician`, `IsUKM` permission classes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [ ] 14.2 Buat endpoints untuk user management
    - Implementasi `POST /users` untuk create user (ADMIN only)
    - Implementasi `GET /users` dengan filter role (ADMIN only)
    - Implementasi `DELETE /users/{id}` (ADMIN only)
    - Tambahkan auto-generate password 12 karakter
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 14.3 Write unit tests untuk user management
    - Test create user dengan role berbeda
    - Test list users dengan filter
    - Test delete user
    - Test permission checks
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ] 14.4 Apply permission classes ke semua endpoints
    - Tambahkan permission classes ke setiap viewset/view
    - Pastikan UKM hanya bisa akses own loans
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 6.4_
  
  - [ ]* 14.5 Write integration tests untuk permissions
    - Test setiap role hanya bisa akses endpoint yang diizinkan
    - Test unauthorized access returns 403
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [ ] 15. Implementasi AuditLog dan dashboard
  - [ ] 15.1 Buat model AuditLog
    - Implementasi model `AuditLog` dengan field `user`, `action`, `entity_type`, `entity_id`, `description`, `ip_address`, `user_agent`
    - _Requirements: 14.1, 14.2, 14.3, 14.4_
  
  - [ ] 15.2 Tambahkan audit logging ke semua operasi penting
    - Tambahkan audit log creation di approve/reject loan
    - Tambahkan audit log creation di process return
    - Tambahkan audit log creation di complete maintenance
    - Capture IP address dan user agent dari request
    - _Requirements: 7.6, 8.5, 9.5, 12.6, 14.3, 14.4_
  
  - [ ]* 15.3 Write property test untuk audit log
    - **Property 37: Audit Log Captures Request Metadata**
    - **Validates: Requirements 14.4**
  
  - [ ] 15.4 Buat endpoint untuk audit logs
    - Implementasi `GET /audit-logs` dengan filter action, entity_type, date range (ADMIN only)
    - _Requirements: 14.1, 14.2, 14.5_
  
  - [ ] 15.5 Implementasi dashboard summary endpoint
    - Implementasi `GET /dashboard/summary` dengan statistik real-time
    - Hitung total assets, damaged assets, borrowed assets
    - Hitung pending loan requests, active maintenance tasks
    - Return recent damage reports dan upcoming services
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ]* 15.6 Write unit tests untuk dashboard dan audit log
    - Test dashboard summary calculation
    - Test audit log filtering
    - Test permission checks
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 14.1, 14.2, 14.5_

- [ ] 16. Implementasi error handling dan validation
  - [ ] 16.1 Buat custom exception classes
    - Implementasi custom exceptions untuk business logic errors
    - Implementasi exception handler untuk format error standar
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_
  
  - [ ] 16.2 Tambahkan error handling ke semua endpoints
    - Wrap business logic dalam try-except blocks
    - Return error responses dengan format standar
    - Log errors dengan appropriate severity level
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6_
  
  - [ ]* 16.3 Write unit tests untuk error handling
    - Test validation errors return 400
    - Test authentication errors return 401
    - Test authorization errors return 403
    - Test not found errors return 404
    - Test conflict errors return 409
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [ ] 17. Checkpoint - Pastikan error handling dan audit trail lengkap
  - Pastikan semua tests pass, tanyakan user jika ada pertanyaan.

- [ ] 18. Implementasi WhatsApp notification dengan Celery
  - [ ] 18.1 Setup Celery dan Redis
    - Konfigurasi Celery dengan Redis sebagai message broker
    - Buat Celery tasks untuk WhatsApp notification
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_
  
  - [ ] 18.2 Implementasi WhatsApp notification service
    - Buat async task `send_whatsapp_notification()`
    - Integrate dengan WhatsApp API
    - Tambahkan error handling dan retry mechanism
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_
  
  - [ ] 18.3 Trigger notifikasi di approval dan rejection
    - Trigger notifikasi saat loan approved
    - Trigger notifikasi saat loan rejected
    - Trigger notifikasi saat loan created (ke STAFF)
    - _Requirements: 18.1, 18.2, 18.3, 6.5, 7.7_
  
  - [ ]* 18.4 Write unit tests untuk WhatsApp notification
    - Test notification triggered dengan data correct
    - Test error handling jika API gagal
    - _Requirements: 18.1, 18.2, 18.3, 18.4_

- [ ] 19. Implementasi search, filter, dan pagination
  - [ ] 19.1 Tambahkan search dan filter ke Asset endpoints
    - Implementasi search by name atau code
    - Implementasi filter by category dan status
    - _Requirements: 20.1, 20.2, 20.3_
  
  - [ ] 19.2 Tambahkan pagination ke semua list endpoints
    - Konfigurasi default page size 20 items
    - Konfigurasi max page size 100 items
    - Return metadata pagination (count, next, previous)
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_
  
  - [ ]* 19.3 Write unit tests untuk search, filter, pagination
    - Test search functionality
    - Test filter functionality
    - Test pagination metadata
    - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5, 20.1, 20.2, 20.3, 20.4, 20.5_

- [ ] 20. Optimasi performa dan security
  - [ ] 20.1 Tambahkan database indexing
    - Tambahkan index pada foreign keys
    - Tambahkan index pada frequently queried fields
    - Tambahkan composite index untuk query optimization
    - _Requirements: Performance Considerations_
  
  - [ ] 20.2 Implementasi query optimization
    - Gunakan `select_related()` untuk ForeignKey
    - Gunakan `prefetch_related()` untuk reverse ForeignKey
    - Avoid N+1 queries
    - _Requirements: Performance Considerations_
  
  - [ ] 20.3 Implementasi security measures
    - Konfigurasi HTTPS only in production
    - Enable CSRF protection
    - Implement rate limiting
    - Validate file uploads
    - _Requirements: Security Considerations_
  
  - [ ]* 20.4 Write integration tests untuk end-to-end flows
    - Test complete loan flow: create → approve → return (BAIK)
    - Test complete loan flow: create → approve → return (RUSAK) → maintenance
    - Test authentication flow: login → access protected endpoint → refresh token
    - _Requirements: Integration Testing_

- [ ] 21. Final checkpoint - Pastikan semua tests pass dan sistem siap deploy
  - Pastikan semua tests pass, tanyakan user jika ada pertanyaan.

## Catatan

- Tasks yang ditandai dengan `*` adalah optional dan dapat di-skip untuk MVP lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Checkpoints memastikan validasi incremental
- Property tests memvalidasi universal correctness properties
- Unit tests memvalidasi contoh spesifik dan edge cases
- Implementasi menggunakan Python dengan Django REST Framework
- Database menggunakan MySQL 8.0+
- Testing menggunakan pytest dan hypothesis untuk property-based testing
