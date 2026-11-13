# Tech Stack

Daftar lengkap teknologi yang digunakan dalam project Mochimod ID beserta versi dan alasan pemilihan.

---

## Backend

| Teknologi | Versi | Keterangan |
|---|---|---|
| **PHP** | `^8.3` | Minimum requirement Laravel 13; memanfaatkan fitur modern PHP seperti readonly properties dan PHP Attribute |
| **Laravel** | `^13` | Framework PHP utama; menangani routing, ORM (Eloquent), autentikasi, queue, dan PDF generation |
| **Inertia.js** (server adapter) | `^3.0` | Jembatan antara Laravel dan React — controller mengembalikan "props" ke React tanpa membangun REST API secara eksplisit |
| **barryvdh/laravel-dompdf** | `*` | Generate file PDF untuk struk transaksi dan laporan penjualan (format A5) |
| **Laravel Wayfinder** | `^0.1.14` | Menghasilkan helper TypeScript yang type-safe dari route Laravel — route di frontend ditulis dalam TypeScript, bukan string mentah |

---

## Frontend

| Teknologi | Versi | Keterangan |
|---|---|---|
| **React** | `^19` | Library UI utama; semua halaman dibangun sebagai komponen React |
| **TypeScript** | `^5.7` | Type safety untuk mencegah bug runtime; semua file frontend ditulis `.tsx` / `.ts` |
| **Tailwind CSS** | `^4.0` | Utility-first CSS framework; styling langsung di JSX tanpa file CSS terpisah |
| **Vite** | `^8` | Bundler modern dengan Hot Module Replacement (HMR) yang cepat saat development |
| **Inertia.js** (client adapter) | `^3.8` | Sisi React dari Inertia — menerima props dari Laravel dan merender halaman |
| **clsx + tailwind-merge** | latest | Utility untuk menggabungkan class Tailwind secara kondisional tanpa konflik |

---

## Database

| Teknologi | Keterangan |
|---|---|
| **MySQL** | Digunakan di lingkungan production |
| **SQLite** | Default untuk development lokal — tidak perlu setup server database terpisah |

---

## Pembayaran

| Metode | Keterangan |
|---|---|
| **Tunai (Cash)** | Kasir input nominal uang diterima; sistem otomatis hitung kembalian |
| **QRIS Statis** | Kasir menampilkan QR Code statis kepada pelanggan; konfirmasi pembayaran dilakukan secara manual oleh kasir |

> **Catatan:** Aplikasi ini tidak menggunakan payment gateway (Midtrans atau lainnya). QRIS yang digunakan adalah QRIS statis dari rekening bank/e-wallet toko, bukan QRIS dinamis dari payment gateway. Konfirmasi pembayaran sepenuhnya manual.

---

## Tooling & Quality Assurance

| Teknologi | Versi | Keterangan |
|---|---|---|
| **Laravel Pint** | `^1` | Code formatter PHP otomatis — memastikan gaya kode konsisten (PSR-12) |
| **Larastan** | `^3` | PHPStan untuk Laravel — static analysis untuk menemukan bug sebelum runtime |
| **Pest PHP** | `^5.3` | Framework testing PHP modern dengan sintaks ekspresif |
| **Laravel Sail** | `^1.53` | Tersedia sebagai alternatif environment berbasis Docker (tidak wajib digunakan) |

---

## Development Environment

Project ini dikembangkan menggunakan **lerd** — environment PHP lokal berbasis Podman.

| Komponen | Nilai |
|---|---|
| PHP (dalam container) | `8.5` |
| Node.js | `24` |
| Services aktif | MySQL, Redis, Mailpit |
| Workers aktif | Queue, Schedule, Vite (HMR) |

---

## Navigasi Dokumentasi

- [← Gambaran Umum](./01-overview.md)
- [Getting Started →](./03-getting-started.md)
