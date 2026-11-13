# Konfigurasi Environment

Panduan lengkap untuk memahami dan mengatur variabel environment (`.env`) di project Mochimod ID.

---

## Overview

File `.env` menyimpan semua konfigurasi sensitif dan environment-specific (URL, kredensial database, API key, dll). File ini **tidak boleh di-commit ke Git** (sudah ada di `.gitignore`).

Untuk memulai, copy `.env.example`:
```bash
cp .env.example .env
php artisan key:generate
```

---

## Variabel Penting

### Konfigurasi Aplikasi

| Variabel | Nilai Default | Keterangan |
|---|---|---|
| `APP_NAME` | `Laravel` | Ubah ke `Mochimod ID` |
| `APP_ENV` | `local` | Environment: `local`, `staging`, atau `production` |
| `APP_KEY` | *(kosong)* | Generate dengan `php artisan key:generate` — **wajib diisi** |
| `APP_DEBUG` | `true` | Set `false` di production — `true` menampilkan detail error |
| `APP_URL` | `http://localhost:8000` | URL publik aplikasi |
| `APP_TIMEZONE` | `UTC` | Tambahkan `APP_TIMEZONE=Asia/Jakarta` untuk WIB |
| `APP_LOCALE` | `en` | Locale default |

### Database

| Variabel | Nilai Default | Keterangan |
|---|---|---|
| `DB_CONNECTION` | `sqlite` | `sqlite` (dev) atau `mysql` (production) |
| `DB_HOST` | `127.0.0.1` | Host database MySQL |
| `DB_PORT` | `3306` | Port MySQL |
| `DB_DATABASE` | — | Nama database |
| `DB_USERNAME` | — | Username database |
| `DB_PASSWORD` | — | Password database |

**Development dengan SQLite (default):**
```env
DB_CONNECTION=sqlite
# File database otomatis di database/database.sqlite
```

**Development/Production dengan MySQL:**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mochimod_id
DB_USERNAME=root
DB_PASSWORD=your_password
```

### Session & Cache

| Variabel | Nilai Default | Keterangan |
|---|---|---|
| `SESSION_DRIVER` | `database` | Simpan session di database — sudah tepat, jangan ubah |
| `SESSION_LIFETIME` | `120` | Durasi session dalam menit |
| `CACHE_STORE` | `database` | Cache di database — sudah tepat untuk setup ini |

### QRIS Statis

| Variabel | Contoh Nilai | Keterangan |
|---|---|---|
| `QRIS_MERCHANT_ID` | `ID1026...` | NMID (Nomor Merchant ID) dari rekening QRIS toko — ditampilkan di halaman checkout |

> **Catatan:** QRIS yang digunakan adalah **QRIS statis** dari bank/e-wallet toko, bukan dari payment gateway. `QRIS_MERCHANT_ID` digunakan hanya sebagai referensi/identifikasi merchant, tidak ada integrasi API payment.

### Informasi Toko (untuk PDF Struk & Laporan)

Variabel ini **belum ada di `.env.example`** — tambahkan secara manual ke `.env`:

| Variabel | Contoh Nilai | Keterangan |
|---|---|---|
| `STORE_NAME` | `Mochimod` | Nama toko yang muncul di header struk PDF |
| `STORE_ADDRESS` | `Jl. Contoh No. 1` | Alamat toko di struk PDF |
| `STORE_PHONE` | `08123456789` | Nomor telepon toko di struk PDF |

### Logging

| Variabel | Nilai Default | Keterangan |
|---|---|---|
| `LOG_CHANNEL` | `stack` | Channel log |
| `LOG_LEVEL` | `debug` | Level log minimum; gunakan `error` di production |

### Mail (Opsional)

Aplikasi saat ini tidak mengirim email secara aktif. Untuk development, biarkan default menggunakan `log` driver (email ditulis ke log, tidak dikirim):

```env
MAIL_MAILER=log
```

---

## Contoh `.env` untuk Development

```env
APP_NAME="Mochimod ID"
APP_ENV=local
APP_KEY=base64:...  # generate dengan php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000
APP_TIMEZONE=Asia/Jakarta

DB_CONNECTION=sqlite

SESSION_DRIVER=database
CACHE_STORE=database

QRIS_MERCHANT_ID=ID1026xxxxxxxxxxxxxxx

STORE_NAME=Mochimod
STORE_ADDRESS=Jl. Contoh No. 1, Kota
STORE_PHONE=08123456789

LOG_CHANNEL=stack
LOG_LEVEL=debug
MAIL_MAILER=log
```

---

## Variabel yang TIDAK Boleh Diubah

| Variabel | Alasan |
|---|---|
| `SESSION_DRIVER=database` | Aplikasi bergantung pada session berbasis database; mengubah ke `file` atau `cookie` dapat merusak autentikasi |
| `QUEUE_CONNECTION=database` | Queue berjalan di database; ubah hanya jika setup Redis tersedia |

---

## Peringatan Keamanan

> **JANGAN commit file `.env` ke Git.**

File `.env` sudah terdaftar di `.gitignore`. Jika tidak sengaja ter-commit:
1. Hapus dari tracking: `git rm --cached .env`
2. Rotasi semua kredensial yang sudah ter-expose (database password, app key, dll)
3. Commit perubahan

---

## Navigasi Dokumentasi

- [← Frontend](./08-frontend.md)
- [Testing →](./10-testing.md)
