# Arsitektur Aplikasi

Penjelasan tentang bagaimana potongan-potongan aplikasi Mochimod ID saling terhubung.

---

## Pola Arsitektur

Aplikasi ini menggunakan pola **MVC (Model-View-Controller)** dari Laravel, dengan Inertia.js sebagai "jembatan" antara backend PHP dan frontend React.

**Inertia.js** memungkinkan developer menulis frontend sebagai komponen React yang sepenuhnya, tanpa perlu membangun REST API secara eksplisit. Controller Laravel mengembalikan data langsung sebagai "props" ke halaman React — mirip seperti server-side rendering, namun navigasi antar halaman tetap terasa seperti Single Page Application (SPA).

---

## Diagram Alur Request

```
┌─────────────────────────────────────────────────────┐
│                   Browser (React/Inertia)           │
│  Navigasi / Form Submit → Inertia request           │
└──────────────────────┬──────────────────────────────┘
                       │ HTTP (Inertia Protocol)
                       ▼
┌─────────────────────────────────────────────────────┐
│              routes/web.php (Laravel Router)        │
│  Semua route dilindungi middleware `auth`           │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────┐
│          app/Http/Controllers/                      │
│  AuthController  │  PosController                  │
│  ProductController│  CheckoutController             │
│  SalesReportController                              │
└──────────┬────────────────────┬────────────────────┘
           │                    │
           ▼                    ▼
┌──────────────────┐  ┌──────────────────────────────┐
│  app/Models/     │  │  app/Services/               │
│  User            │  │  SalesReportService          │
│  Product         │  │  (logika laporan kompleks)   │
│  Category        │  └──────────────────────────────┘
│  Transaction     │
│  TransactionItem │
└──────────┬───────┘
           │
           ▼
┌─────────────────────────────────────────────────────┐
│              Database (MySQL / SQLite)               │
│  users │ categories │ products                      │
│  transactions │ transaction_items                   │
└─────────────────────────────────────────────────────┘
```

---

## Contoh Alur Request: Kasir Melakukan Checkout

Ini adalah alur lengkap dari klik tombol "Bayar" hingga struk tampil:

1. **React** (`checkout.tsx`) mengirim `POST /checkout/confirm` via Inertia dengan data item dan metode pembayaran
2. **Laravel Router** (`routes/web.php`) menerima request dan mengarahkan ke `CheckoutController@confirm`
3. **CheckoutController** memvalidasi data via `CheckoutRequest`
4. Controller mengambil data produk dari database dengan **lock for update** (mencegah race condition stok)
5. Controller memvalidasi: produk ada? aktif? stok cukup? uang cukup (jika tunai)?
6. Jika valid, controller membuka **database transaction** (`DB::transaction`):
   - Membuat record `Transaction` baru dengan kode unik (format: `TRX-YYYYMMDD-XXXX`)
   - Membuat record `TransactionItem` untuk setiap item (menyimpan snapshot nama & harga produk)
   - Mengurangi stok setiap produk
7. Cache laporan penjualan di-flush agar data laporan terupdate
8. Controller redirect ke `checkout.receipt` dengan Inertia
9. **React** (`receipt.tsx`) merender halaman struk dengan data transaksi

---

## Struktur Direktori Penting

```
mochimod-id/
├── app/
│   ├── Http/
│   │   ├── Controllers/        # Menerima request, memanggil model/service, return Inertia
│   │   │   ├── AuthController.php
│   │   │   ├── PosController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CheckoutController.php
│   │   │   └── SalesReportController.php
│   │   ├── Middleware/
│   │   │   └── HandleInertiaRequests.php   # Share data global ke semua halaman React
│   │   └── Requests/           # Form Request Validation
│   ├── Models/                 # Eloquent ORM — satu file per tabel database
│   │   ├── User.php
│   │   ├── Category.php
│   │   ├── Product.php
│   │   ├── Transaction.php
│   │   └── TransactionItem.php
│   └── Services/
│       └── SalesReportService.php  # Logika laporan yang kompleks dipisahkan dari controller
│
├── database/
│   ├── migrations/             # Definisi skema tabel database
│   ├── seeders/                # Data awal (admin, kategori, produk contoh)
│   └── factories/              # Data dummy untuk testing
│
├── resources/
│   ├── js/                     # Semua kode frontend (React + TypeScript)
│   │   ├── pages/              # Satu file = satu halaman (dirender oleh Inertia)
│   │   ├── components/         # Komponen React yang dipakai ulang
│   │   ├── layouts/            # Layout wrapper
│   │   ├── types/              # TypeScript type definitions
│   │   ├── lib/                # Utility/helper functions
│   │   ├── actions/            # Inertia form action helpers
│   │   └── wayfinder/          # Auto-generated route helpers (JANGAN edit manual)
│   └── views/
│       ├── app.blade.php       # Layout Blade utama (entry point Inertia)
│       └── receipts/           # Template Blade untuk PDF struk
│           └── reports/        # Template Blade untuk PDF laporan
│
├── routes/
│   └── web.php                 # Semua route web
│
└── tests/
    ├── Unit/                   # Unit test (logika murni, tanpa database/HTTP)
    └── Feature/                # Feature test (HTTP request, database)
```

---

## Middleware

### `auth`
Semua route kecuali `/login` dilindungi middleware `auth` bawaan Laravel. Jika user belum login, otomatis diarahkan ke halaman login.

### `HandleInertiaRequests`
Middleware khusus Inertia yang berjalan pada setiap request. Digunakan untuk berbagi data global ke semua halaman React, misalnya data user yang sedang login (`auth.user`).

---

## Kenapa Pakai `SalesReportService`?

Logika laporan penjualan cukup kompleks — melibatkan agregasi data, filter tanggal, perhitungan per kategori, dan caching. Jika semua logika ini ditulis langsung di `SalesReportController`, controller akan menjadi sangat panjang dan sulit ditest.

Dengan memisahkannya ke `SalesReportService`:
- Controller tetap ramping (hanya handle HTTP)
- Logika bisnis bisa ditest secara unit tanpa HTTP overhead
- Kode lebih mudah di-maintain

---

## Navigasi Dokumentasi

- [← Getting Started](./03-getting-started.md)
- [Database & Model →](./05-database.md)
