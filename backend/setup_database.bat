@echo off
echo ========================================
echo Setup Database Smart-Inventory STTR
echo ========================================
echo.
echo Pastikan MySQL sudah berjalan!
echo.
echo Masukkan password MySQL root Anda:
set /p MYSQL_PASSWORD=Password: 

echo.
echo Membuat database...
mysql -u root -p%MYSQL_PASSWORD% < create_database.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database berhasil dibuat!
    echo ========================================
    echo.
    echo Langkah selanjutnya:
    echo 1. Edit file .env dan isi DB_PASSWORD dengan password MySQL Anda
    echo 2. Jalankan: python manage.py makemigrations
    echo 3. Jalankan: python manage.py migrate
    echo 4. Jalankan: python manage.py createsuperuser
    echo.
) else (
    echo.
    echo ========================================
    echo ERROR: Gagal membuat database!
    echo ========================================
    echo Pastikan:
    echo - MySQL sudah berjalan
    echo - Password yang dimasukkan benar
    echo - User root memiliki akses untuk membuat database
    echo.
)

pause
