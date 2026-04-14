-- Script untuk membuat database Smart-Inventory STTR
-- Jalankan script ini di MySQL sebelum menjalankan migrations Django

-- Buat database jika belum ada
CREATE DATABASE IF NOT EXISTS smart_inventory_sttr 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Gunakan database
USE smart_inventory_sttr;

-- Tampilkan konfirmasi
SELECT 'Database smart_inventory_sttr berhasil dibuat!' AS status;

-- Optional: Buat user dedicated untuk aplikasi (recommended untuk production)
-- Uncomment baris di bawah dan ganti password sesuai kebutuhan
-- CREATE USER IF NOT EXISTS 'inventory_user'@'localhost' IDENTIFIED BY 'your_secure_password';
-- GRANT ALL PRIVILEGES ON smart_inventory_sttr.* TO 'inventory_user'@'localhost';
-- FLUSH PRIVILEGES;
-- SELECT 'User inventory_user berhasil dibuat dan diberi akses!' AS status;
