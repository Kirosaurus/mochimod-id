# Getting Started

Panduan lengkap untuk menyiapkan dan menjalankan project Mochimod ID di environment lokal.

---

## Prasyarat

Pastikan software berikut sudah terinstal:

| Software | Versi Minimum | Cek Versi |
|---|---|---|
| PHP | `8.3` | `php --version` |
| Composer | `2.x` | `composer --version` |
| Node.js | `20+` | `node --version` |
| npm | `10+` | `npm --version` |
| Git | `2.x` | `git --version` |
| MySQL | `8.0+` | *(opsional, SQLite cukup untuk dev)* |

---

## Instalasi Cepat

```bash
git clone <url-repository>
cd mochimod-id
composer run setup
```

Perintah `composer run setup` akan menjalankan seluruh langkah berikut secara otomatis:
1. `composer install` — install PHP dependencies
2. Copy `.env.example` ke `.env`
3. `php artisan key:generate` — generate application key
4. `php artisan migrate --force` — jalankan semua migrasi database
5. `npm install` — install JavaScript dependencies
6. `npm run build` — build asset frontend

---

## Instalasi Manual (Langkah per Langkah)

Jika ingin memahami setiap langkah atau ada error di instalasi cepat:

### 1. Clone Repository

```bash
git clone <url-repository>
cd mochimod-id
```

### 2. Install PHP Dependencies

```bash
composer install
```

### 3. Konfigurasi Environment

```bash
cp .env.example .env
php artisan key:generate
```

Buka file `.env` dan sesuaikan konfigurasi database (lihat [docs/09-environment.md](./09-environment.md) untuk penjelasan lengkap).

Untuk development dengan SQLite (default, paling mudah):
```
DB_CONNECTION=sqlite
```

Untuk development dengan MySQL:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mochimod_id
DB_USERNAME=root
DB_PASSWORD=your_password
```

### 4. Jalankan Migrasi Database

```bash
php artisan migrate
```

### 5. Isi Data Awal (Seeder)

```bash
php artisan db:seed
```

Seeder akan membuat:
- **1 akun admin**: `admin@mochimod.id` / `mochimod123`
- **2 kategori**: Mochi, Jus
- **10 produk**: 6 varian mochi + 4 varian jus

### 6. Install JavaScript Dependencies

```bash
npm install
```

### 7. Build Asset Frontend

Untuk production:
```bash
npm run build
```

Untuk development (dengan HMR):
```bash
npm run dev
```

---

## Menjalankan Aplikasi

### Cara Termudah (Laravel + Vite bersamaan)

```bash
composer run dev
```

Perintah ini menjalankan Laravel dev server dan Vite HMR secara bersamaan menggunakan `php artisan dev`.

### Cara Manual

Terminal 1 — Laravel server:
```bash
php artisan serve
```

Terminal 2 — Vite (HMR):
```bash
npm run dev
```

Aplikasi tersedia di `http://localhost:8000`.

---

## Default Credentials

Setelah menjalankan seeder (`php artisan db:seed`):

| Field | Value |
|---|---|
| Email | `admin@mochimod.id` |
| Password | `mochimod123` |

> **Penting:** Ganti password ini setelah deployment ke production.

---

## Membuat Akun Kasir Baru

Gunakan Laravel Tinker untuk membuat akun baru:

```bash
php artisan tinker --execute="App\Models\User::create(['name' => 'Nama Kasir', 'username' => 'kasir01', 'email' => 'kasir@example.com', 'password' => bcrypt('password_baru')])"
```

---

## Troubleshooting Umum

### Error: `php_fileinfo` extension not loaded

```bash
# Di php.ini, aktifkan:
extension=fileinfo
```

### Error: `Could not open input file: artisan`

Pastikan Anda berada di root directory project (folder yang berisi file `artisan`).

### Error: `SQLSTATE[HY000]: no such table`

Jalankan migrasi:
```bash
php artisan migrate
```

### Asset tidak muncul di browser

```bash
npm run build
```

Atau jalankan Vite dev server:
```bash
npm run dev
```

---

## Navigasi Dokumentasi

- [← Tech Stack](./02-tech-stack.md)
- [Arsitektur →](./04-architecture.md)
