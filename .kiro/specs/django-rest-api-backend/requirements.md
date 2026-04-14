# Dokumen Requirements: Backend API Django REST Framework untuk Smart-Inventory STTR

## Pendahuluan

Backend API ini adalah sistem manajemen inventori kampus "Smart-Inventory STTR" yang dibangun menggunakan Django REST Framework dengan database MySQL. Sistem ini mengelola aset kampus (barang dan ruangan), peminjaman oleh mahasiswa dan UKM, pengembalian dengan tracking kondisi, pelaporan kerusakan, dan pemeliharaan aset dengan anggaran perbaikan. Sistem mengimplementasikan role-based access control (RBAC) untuk 4 role: ADMIN, STAFF, TEKNISI, dan UKM.

## Glossary

- **System**: Backend API Django REST Framework untuk Smart-Inventory STTR
- **User**: Pengguna sistem dengan role tertentu (ADMIN, STAFF, TEKNISI, UKM)
- **Guest**: Mahasiswa yang meminjam aset tanpa akun (menggunakan NIM)
- **Asset**: Aset kampus berupa barang atau ruangan
- **LoanRequest**: Pengajuan peminjaman aset
- **ReturnLog**: Catatan pengembalian aset
- **DamageReport**: Laporan kerusakan aset
- **MaintenanceTask**: Task pemeliharaan/perbaikan aset
- **RepairBudget**: Anggaran perbaikan aset
- **ApprovalLog**: Log persetujuan/penolakan peminjaman
- **AuditLog**: Log audit untuk tracking aktivitas penting
- **JWT_Token**: JSON Web Token untuk autentikasi
- **API_Client**: Aplikasi frontend atau client yang mengakses API

## Requirements

### Requirement 1: Autentikasi User

**User Story:** Sebagai user sistem, saya ingin login dengan username dan password, sehingga saya dapat mengakses fitur sesuai role saya.

#### Acceptance Criteria

1. WHEN User mengirim request login dengan username dan password yang valid, THEN THE System SHALL mengembalikan access token dan refresh token (JWT)
2. WHEN User mengirim request login dengan username atau password yang salah, THEN THE System SHALL mengembalikan error 401 Unauthorized
3. WHEN User mengirim request dengan access token yang expired, THEN THE System SHALL mengembalikan error 401 dengan pesan token kadaluarsa
4. WHEN User mengirim request refresh token dengan refresh token yang valid, THEN THE System SHALL mengembalikan access token baru
5. WHEN User mengirim request logout dengan refresh token, THEN THE System SHALL menambahkan token ke blacklist dan mengembalikan konfirmasi logout berhasil

### Requirement 2: Otorisasi Berbasis Role

**User Story:** Sebagai sistem, saya ingin membatasi akses endpoint berdasarkan role user, sehingga setiap user hanya dapat mengakses fitur yang sesuai dengan role mereka.

#### Acceptance Criteria

1. WHEN User dengan role ADMIN mengakses endpoint apapun, THEN THE System SHALL mengizinkan akses
2. WHEN User dengan role STAFF mengakses endpoint peminjaman atau pengembalian, THEN THE System SHALL mengizinkan akses
3. WHEN User dengan role TEKNISI mengakses endpoint maintenance tasks, THEN THE System SHALL mengizinkan akses
4. WHEN User dengan role UKM mengakses endpoint selain create loan request atau view own loans, THEN THE System SHALL mengembalikan error 403 Forbidden
5. WHEN User yang tidak terautentikasi mengakses endpoint yang memerlukan autentikasi, THEN THE System SHALL mengembalikan error 401 Unauthorized

### Requirement 3: Manajemen User

**User Story:** Sebagai ADMIN, saya ingin membuat akun user baru (UKM, STAFF, TEKNISI), sehingga mereka dapat mengakses sistem.

#### Acceptance Criteria

1. WHEN ADMIN membuat user baru dengan data valid, THEN THE System SHALL menyimpan user dengan password ter-hash dan mengembalikan kredensial auto-generated
2. WHEN ADMIN membuat user dengan username yang sudah ada, THEN THE System SHALL mengembalikan error 400 dengan pesan username sudah digunakan
3. WHEN ADMIN membuat user dengan role yang tidak valid, THEN THE System SHALL mengembalikan error 400 dengan pesan role tidak valid
4. WHEN ADMIN menghapus user, THEN THE System SHALL menghapus user dari database dan mengembalikan status 204 No Content
5. WHEN ADMIN melihat daftar user dengan filter role, THEN THE System SHALL mengembalikan list user yang sesuai dengan role yang difilter

### Requirement 4: Manajemen Aset

**User Story:** Sebagai STAFF, saya ingin melihat dan mengelola data aset kampus, sehingga saya dapat melacak ketersediaan dan kondisi aset.

#### Acceptance Criteria

1. WHEN User mengakses list aset dengan filter kategori dan status, THEN THE System SHALL mengembalikan list aset yang sesuai dengan filter
2. WHEN User mengakses detail aset dengan ID valid, THEN THE System SHALL mengembalikan data lengkap aset termasuk kategori dan lokasi
3. WHEN User mengakses detail aset dengan ID yang tidak ada, THEN THE System SHALL mengembalikan error 404 Not Found
4. THE System SHALL memastikan setiap aset memiliki code yang unik
5. THE System SHALL memastikan status aset selalu dalam nilai yang valid (TERSEDIA, DIPINJAM, PERBAIKAN, RUSAK)

### Requirement 5: Pengajuan Peminjaman oleh Guest

**User Story:** Sebagai mahasiswa (Guest), saya ingin mengajukan peminjaman aset tanpa akun, sehingga saya dapat meminjam aset untuk keperluan akademik.

#### Acceptance Criteria

1. WHEN Guest mengirim request peminjaman dengan borrower_type GUEST dan data NIM, nama, phone valid, THEN THE System SHALL membuat LoanRequest dengan status PENDING dan loan_code unik
2. WHEN Guest mengirim request peminjaman dengan borrower_type GUEST tanpa NIM, THEN THE System SHALL mengembalikan error 400 dengan pesan NIM wajib diisi
3. WHEN Guest mengirim request peminjaman dengan return_date lebih kecil dari loan_date, THEN THE System SHALL mengembalikan error 400 dengan pesan tanggal tidak valid
4. WHEN Guest mengirim request peminjaman dengan aset yang tidak tersedia, THEN THE System SHALL mengembalikan error 400 dengan pesan aset tidak tersedia
5. WHEN LoanRequest berhasil dibuat, THEN THE System SHALL membuat ApprovalLog dengan action SUBMITTED

### Requirement 6: Pengajuan Peminjaman oleh UKM

**User Story:** Sebagai UKM, saya ingin mengajukan peminjaman aset menggunakan akun UKM, sehingga saya dapat meminjam aset untuk kegiatan UKM.

#### Acceptance Criteria

1. WHEN User dengan role UKM mengirim request peminjaman dengan borrower_type UKM, THEN THE System SHALL membuat LoanRequest dengan ukm_account terisi dan status PENDING
2. WHEN User dengan role UKM mengirim request peminjaman dengan borrower_type GUEST, THEN THE System SHALL mengembalikan error 400 dengan pesan UKM harus menggunakan borrower_type UKM
3. WHEN LoanRequest dengan borrower_type UKM berhasil dibuat, THEN THE System SHALL memastikan field guest_nim, guest_name, guest_phone bernilai NULL
4. WHEN User dengan role UKM melihat daftar peminjaman, THEN THE System SHALL hanya mengembalikan peminjaman milik UKM tersebut
5. WHEN LoanRequest berhasil dibuat, THEN THE System SHALL mengirim notifikasi WhatsApp ke STAFF

### Requirement 7: Approval Peminjaman

**User Story:** Sebagai STAFF, saya ingin menyetujui atau menolak pengajuan peminjaman, sehingga saya dapat mengontrol penggunaan aset kampus.

#### Acceptance Criteria

1. WHEN STAFF menyetujui LoanRequest dengan status PENDING dan semua aset tersedia, THEN THE System SHALL mengubah status LoanRequest menjadi APPROVED dan status semua aset menjadi DIPINJAM
2. WHEN STAFF menyetujui LoanRequest dengan aset yang tidak tersedia, THEN THE System SHALL mengembalikan error 400 dengan pesan aset tidak tersedia
3. WHEN STAFF menolak LoanRequest dengan status PENDING, THEN THE System SHALL mengubah status LoanRequest menjadi REJECTED dan status aset tetap TERSEDIA
4. WHEN STAFF menolak LoanRequest tanpa mengisi notes, THEN THE System SHALL mengembalikan error 400 dengan pesan alasan penolakan wajib diisi
5. WHEN STAFF menyetujui atau menolak LoanRequest, THEN THE System SHALL membuat ApprovalLog dengan action APPROVED atau REJECTED dan approver terisi
6. WHEN LoanRequest disetujui atau ditolak, THEN THE System SHALL membuat AuditLog dengan action APPROVE_LOAN atau REJECT_LOAN
7. WHEN LoanRequest disetujui atau ditolak, THEN THE System SHALL mengirim notifikasi WhatsApp ke peminjam

### Requirement 8: Pengembalian Aset dengan Kondisi Baik

**User Story:** Sebagai STAFF, saya ingin mencatat pengembalian aset dengan kondisi baik, sehingga aset dapat tersedia kembali untuk dipinjam.

#### Acceptance Criteria

1. WHEN STAFF memproses pengembalian dengan kondisi BAIK untuk LoanRequest yang APPROVED, THEN THE System SHALL membuat ReturnLog dan mengubah status LoanRequest menjadi RETURNED
2. WHEN STAFF memproses pengembalian dengan kondisi BAIK, THEN THE System SHALL mengubah status semua aset yang dipinjam menjadi TERSEDIA
3. WHEN STAFF memproses pengembalian untuk LoanRequest yang sudah pernah dikembalikan, THEN THE System SHALL mengembalikan error 409 dengan pesan peminjaman sudah dikembalikan
4. WHEN STAFF memproses pengembalian untuk LoanRequest yang belum APPROVED, THEN THE System SHALL mengembalikan error 400 dengan pesan peminjaman belum disetujui
5. WHEN pengembalian berhasil diproses, THEN THE System SHALL membuat AuditLog dengan action PROCESS_RETURN

### Requirement 9: Pengembalian Aset dengan Kondisi Rusak

**User Story:** Sebagai STAFF, saya ingin mencatat pengembalian aset dengan kondisi rusak, sehingga sistem otomatis membuat laporan kerusakan dan task pemeliharaan.

#### Acceptance Criteria

1. WHEN STAFF memproses pengembalian dengan kondisi RUSAK, THEN THE System SHALL membuat ReturnLog dan mengubah status LoanRequest menjadi RETURNED
2. WHEN STAFF memproses pengembalian dengan kondisi RUSAK, THEN THE System SHALL membuat DamageReport dengan source AUTO_RETURN untuk setiap aset yang dipinjam
3. WHEN STAFF memproses pengembalian dengan kondisi RUSAK, THEN THE System SHALL mengubah status semua aset yang dipinjam menjadi PERBAIKAN
4. WHEN STAFF memproses pengembalian dengan kondisi RUSAK, THEN THE System SHALL membuat MaintenanceTask dengan status MENUNGGU untuk setiap aset yang dipinjam
5. WHEN DamageReport auto-created, THEN THE System SHALL membuat AuditLog dengan action CREATE_DAMAGE_REPORT_AUTO

### Requirement 10: Laporan Kerusakan Manual

**User Story:** Sebagai user, saya ingin melaporkan kerusakan aset secara manual, sehingga kerusakan dapat segera ditangani.

#### Acceptance Criteria

1. WHEN User membuat DamageReport dengan data valid, THEN THE System SHALL menyimpan DamageReport dengan report_code unik dan source MANUAL
2. WHEN User membuat DamageReport tanpa asset_id, THEN THE System SHALL mengembalikan error 400 dengan pesan asset_id wajib diisi
3. WHEN User membuat DamageReport tanpa description, THEN THE System SHALL mengembalikan error 400 dengan pesan description wajib diisi
4. THE System SHALL memastikan setiap DamageReport memiliki report_code yang unik dengan format DMG-YYYY-NNN
5. WHEN User melihat daftar DamageReport, THEN THE System SHALL mengembalikan list DamageReport dengan informasi aset dan reporter

### Requirement 11: Manajemen Maintenance Task

**User Story:** Sebagai TEKNISI, saya ingin melihat dan mengelola task pemeliharaan, sehingga saya dapat memperbaiki aset yang rusak.

#### Acceptance Criteria

1. WHEN TEKNISI melihat daftar MaintenanceTask dengan filter status, THEN THE System SHALL mengembalikan list MaintenanceTask yang sesuai dengan status
2. WHEN TEKNISI memulai MaintenanceTask dengan status MENUNGGU, THEN THE System SHALL mengubah status menjadi PROSES dan mengisi assigned_to dengan teknisi yang memulai
3. WHEN TEKNISI memulai MaintenanceTask dengan status selain MENUNGGU, THEN THE System SHALL mengembalikan error 400 dengan pesan task sudah diproses
4. THE System SHALL memastikan setiap MaintenanceTask memiliki task_code yang unik dengan format MNT-YYYY-NNN
5. THE System SHALL memastikan status MaintenanceTask selalu dalam nilai yang valid (MENUNGGU, PROSES, SELESAI)

### Requirement 12: Penyelesaian Maintenance Task dengan Anggaran

**User Story:** Sebagai TEKNISI, saya ingin menyelesaikan task pemeliharaan dengan mencatat anggaran perbaikan, sehingga biaya perbaikan dapat dilacak.

#### Acceptance Criteria

1. WHEN TEKNISI menyelesaikan MaintenanceTask dengan data budget valid, THEN THE System SHALL mengubah status task menjadi SELESAI dan membuat RepairBudget
2. WHEN TEKNISI menyelesaikan MaintenanceTask, THEN THE System SHALL membuat RepairLog dengan detail pekerjaan dan hasil perbaikan
3. WHEN TEKNISI menyelesaikan MaintenanceTask dengan result SUCCESS, THEN THE System SHALL mengubah status aset menjadi TERSEDIA
4. WHEN RepairBudget dibuat, THEN THE System SHALL memastikan total_cost sama dengan sparepart_total + labor_cost + other_cost
5. WHEN RepairBudget dibuat, THEN THE System SHALL memastikan sparepart_total sama dengan jumlah total dari semua item di sparepart_details
6. WHEN MaintenanceTask selesai, THEN THE System SHALL membuat AuditLog dengan action COMPLETE_MAINTENANCE

### Requirement 13: Dashboard Summary

**User Story:** Sebagai ADMIN atau STAFF, saya ingin melihat ringkasan statistik sistem, sehingga saya dapat memonitor kondisi inventori.

#### Acceptance Criteria

1. WHEN User dengan role ADMIN atau STAFF mengakses dashboard summary, THEN THE System SHALL mengembalikan total aset, aset rusak, aset dipinjam, dan pending loan requests
2. WHEN User dengan role ADMIN atau STAFF mengakses dashboard summary, THEN THE System SHALL mengembalikan list recent damage reports dengan limit 5 item terbaru
3. WHEN User dengan role ADMIN atau STAFF mengakses dashboard summary, THEN THE System SHALL mengembalikan list upcoming maintenance tasks dengan scheduled_date dalam 7 hari ke depan
4. WHEN User dengan role selain ADMIN atau STAFF mengakses dashboard summary, THEN THE System SHALL mengembalikan error 403 Forbidden
5. THE System SHALL menghitung statistik dashboard secara real-time dari database

### Requirement 14: Audit Trail

**User Story:** Sebagai ADMIN, saya ingin melihat log audit aktivitas penting, sehingga saya dapat melacak siapa melakukan apa dan kapan.

#### Acceptance Criteria

1. WHEN ADMIN melihat daftar AuditLog dengan filter action dan entity_type, THEN THE System SHALL mengembalikan list AuditLog yang sesuai dengan filter
2. WHEN ADMIN melihat daftar AuditLog dengan filter tanggal, THEN THE System SHALL mengembalikan list AuditLog dalam rentang tanggal yang ditentukan
3. WHEN User melakukan operasi penting (approve loan, process return, complete maintenance), THEN THE System SHALL membuat AuditLog dengan user, action, entity_type, entity_id, dan description
4. WHEN AuditLog dibuat, THEN THE System SHALL menyimpan IP address dan user agent dari request
5. WHEN User dengan role selain ADMIN mengakses audit logs, THEN THE System SHALL mengembalikan error 403 Forbidden

### Requirement 15: Code Generation

**User Story:** Sebagai sistem, saya ingin generate code unik untuk setiap entitas, sehingga setiap entitas dapat diidentifikasi dengan mudah.

#### Acceptance Criteria

1. WHEN LoanRequest dibuat, THEN THE System SHALL generate loan_code dengan format PJM-YYYY-NNN yang unik
2. WHEN DamageReport dibuat, THEN THE System SHALL generate report_code dengan format DMG-YYYY-NNN yang unik
3. WHEN MaintenanceTask dibuat, THEN THE System SHALL generate task_code dengan format MNT-YYYY-NNN yang unik
4. WHEN Asset dibuat, THEN THE System SHALL generate asset code dengan format AST-YYYY-NNN yang unik
5. FOR ALL generated codes, THE System SHALL memastikan tidak ada duplikasi code dalam database

### Requirement 16: Data Integrity

**User Story:** Sebagai sistem, saya ingin memastikan integritas data, sehingga data selalu konsisten dan valid.

#### Acceptance Criteria

1. WHEN LoanRequest dibuat dengan borrower_type GUEST, THEN THE System SHALL memastikan guest_nim, guest_name, guest_phone terisi dan ukm_account NULL
2. WHEN LoanRequest dibuat dengan borrower_type UKM, THEN THE System SHALL memastikan ukm_account terisi dan guest_nim, guest_name, guest_phone NULL
3. WHEN Asset memiliki status DIPINJAM, THEN THE System SHALL memastikan ada LoanRequest dengan status APPROVED yang meminjam aset tersebut
4. WHEN LoanRequest memiliki ReturnLog, THEN THE System SHALL memastikan LoanRequest memiliki status RETURNED
5. WHEN MaintenanceTask memiliki status SELESAI, THEN THE System SHALL memastikan ada RepairBudget dan RepairLog terkait

### Requirement 17: Error Handling

**User Story:** Sebagai API client, saya ingin menerima error response yang jelas dan konsisten, sehingga saya dapat menangani error dengan baik.

#### Acceptance Criteria

1. WHEN terjadi validation error, THEN THE System SHALL mengembalikan status 400 dengan format error standar yang berisi error code, message, dan details
2. WHEN terjadi authentication error, THEN THE System SHALL mengembalikan status 401 dengan format error standar
3. WHEN terjadi authorization error, THEN THE System SHALL mengembalikan status 403 dengan format error standar
4. WHEN resource tidak ditemukan, THEN THE System SHALL mengembalikan status 404 dengan format error standar
5. WHEN terjadi conflict error, THEN THE System SHALL mengembalikan status 409 dengan format error standar
6. WHEN terjadi internal server error, THEN THE System SHALL mengembalikan status 500 dengan format error standar dan log error ke sistem logging

### Requirement 18: Notifikasi WhatsApp

**User Story:** Sebagai peminjam, saya ingin menerima notifikasi WhatsApp ketika peminjaman saya disetujui atau ditolak, sehingga saya dapat segera mengetahui status peminjaman.

#### Acceptance Criteria

1. WHEN LoanRequest disetujui, THEN THE System SHALL mengirim notifikasi WhatsApp ke phone number peminjam dengan pesan persetujuan
2. WHEN LoanRequest ditolak, THEN THE System SHALL mengirim notifikasi WhatsApp ke phone number peminjam dengan pesan penolakan dan alasan
3. WHEN LoanRequest dibuat, THEN THE System SHALL mengirim notifikasi WhatsApp ke STAFF untuk approval
4. IF pengiriman notifikasi WhatsApp gagal, THEN THE System SHALL log error tetapi tidak menghentikan proses utama
5. THE System SHALL mengirim notifikasi WhatsApp secara asynchronous menggunakan Celery task queue

### Requirement 19: Pagination

**User Story:** Sebagai API client, saya ingin list endpoint mengembalikan data dengan pagination, sehingga performa API tetap baik meskipun data banyak.

#### Acceptance Criteria

1. WHEN API client mengakses list endpoint tanpa parameter page, THEN THE System SHALL mengembalikan halaman pertama dengan default 20 items
2. WHEN API client mengakses list endpoint dengan parameter page, THEN THE System SHALL mengembalikan halaman yang diminta
3. WHEN API client mengakses list endpoint dengan parameter page_size, THEN THE System SHALL mengembalikan jumlah items sesuai page_size (maksimal 100)
4. THE System SHALL mengembalikan metadata pagination yang berisi count, next, dan previous
5. THE System SHALL mengembalikan next dan previous sebagai NULL jika tidak ada halaman berikutnya atau sebelumnya

### Requirement 20: Search dan Filter

**User Story:** Sebagai user, saya ingin mencari dan memfilter data, sehingga saya dapat menemukan data yang saya butuhkan dengan cepat.

#### Acceptance Criteria

1. WHEN User mencari aset dengan parameter search, THEN THE System SHALL mengembalikan aset yang nama atau code-nya mengandung keyword search
2. WHEN User memfilter aset dengan parameter category, THEN THE System SHALL mengembalikan aset yang kategorinya sesuai
3. WHEN User memfilter aset dengan parameter status, THEN THE System SHALL mengembalikan aset yang statusnya sesuai
4. WHEN User mencari LoanRequest dengan parameter loan_id atau nim, THEN THE System SHALL mengembalikan LoanRequest yang sesuai
5. WHEN User memfilter MaintenanceTask dengan parameter status, THEN THE System SHALL mengembalikan MaintenanceTask yang statusnya sesuai
