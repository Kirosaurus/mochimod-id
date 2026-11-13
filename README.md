# Mochimod ID — Aplikasi POS

Aplikasi Point of Sale (POS) berbasis web untuk UMKM **Mochimod**, penjual mochi dan jus. Dibangun menggunakan Laravel 13, Inertia.js, React, dan TypeScript.

## Fitur Utama

- 🛒 **Point of Sale** — Tambah produk ke keranjang dan proses transaksi dengan cepat
- 💳 **Pembayaran** — Mendukung tunai dan QRIS statis
- 🧾 **Struk Digital** — Tampil di browser dan bisa diunduh sebagai PDF
- 📦 **Manajemen Produk & Stok** — CRUD produk lengkap dengan upload gambar
- 📊 **Laporan Penjualan** — Ringkasan, grafik tren, riwayat transaksi, dan ekspor PDF

## Tech Stack

| Layer | Teknologi |
|---|---|
| Backend | PHP 8.3+, Laravel 13, Inertia.js |
| Frontend | React 19, TypeScript, Tailwind CSS v4, Vite 8 |
| Database | MySQL (production) / SQLite (development) |
| PDF | barryvdh/laravel-dompdf |
| Testing | Pest PHP |

## Quick Start

```bash
git clone <url-repository>
cd mochimod-id
composer run setup
composer run dev
```

Aplikasi berjalan di `http://localhost:8000`. Login dengan:
- **Email:** `admin@mochimod.id`
- **Password:** `mochimod123`

## Dokumentasi Lengkap

Semua dokumentasi tersedia di folder [`docs/`](./docs/):

| Dokumen | Keterangan |
|---|---|
| [01 — Gambaran Umum](./docs/01-overview.md) | Konteks bisnis dan fitur |
| [02 — Tech Stack](./docs/02-tech-stack.md) | Teknologi yang digunakan |
| [03 — Getting Started](./docs/03-getting-started.md) | Instalasi dan menjalankan project |
| [04 — Arsitektur](./docs/04-architecture.md) | Struktur dan alur request |
| [05 — Database](./docs/05-database.md) | Skema database dan relasi model |
| [06 — Fitur Aplikasi](./docs/06-features.md) | Detail setiap fitur |
| [07 — Routes](./docs/07-routes.md) | Daftar semua route |
| [08 — Frontend](./docs/08-frontend.md) | Panduan React + Inertia |
| [09 — Konfigurasi Environment](./docs/09-environment.md) | Panduan variabel `.env` |
| [10 — Testing](./docs/10-testing.md) | Cara menjalankan dan menulis test |
| [11 — Kontribusi](./docs/11-contributing.md) | Konvensi kode dan alur Git |

## Lisensi

Project ini dibuat untuk keperluan akademik UMKM Mochimod.
