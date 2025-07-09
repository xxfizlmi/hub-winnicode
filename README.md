# Winnicode-Hub

Sistem Absensi Magang PT Winnicode Garuda Teknologi

## Deskripsi

Aplikasi berbasis web untuk manajemen dan monitoring absensi peserta magang secara real-time. Dibangun menggunakan Laravel, dengan fitur utama:

-   **Absensi online** (check-in & check-out)
-   **Monitoring kehadiran** oleh admin/HR
-   **Rekap dan export data absensi**
-   **Notifikasi & laporan**

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/xxfizlmi/hub-winnicode.git
cd Winnicode-Hub
```

### 2. Install Dependency

```bash
composer install
npm install && npm run dev
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
php artisan key:generate
```

### 4. Migrasi Database

```bash
php artisan migrate --seed
```

### 5. Jalankan Server

```bash
php artisan serve
```
