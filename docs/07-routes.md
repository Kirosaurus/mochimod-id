# Routes

Daftar lengkap semua route yang tersedia di aplikasi Mochimod ID, berdasarkan `routes/web.php`.

---

## Ringkasan

- **Total route:** 15 route
- **Route publik:** 1 (halaman login)
- **Route terproteksi:** 14 (memerlukan autentikasi)
- **Semua route** menggunakan web middleware (session, CSRF, dll)

---

## Route Autentikasi

| Method | URL | Nama Route | Controller | Keterangan |
|---|---|---|---|---|
| `GET` | `/login` | `login` | `AuthController@show` | Tampil halaman login |
| `POST` | `/login` | — | `AuthController@login` | Proses login |
| `POST` | `/logout` | `logout` | *(closure)* | Logout dan invalidate session |

---

## Route Utama (Memerlukan Auth)

| Method | URL | Nama Route | Controller | Keterangan |
|---|---|---|---|---|
| `GET` | `/` | `POS` | `PosController@show` | Halaman Point of Sale |

---

## Route Produk & Stok

Didaftarkan sebagai resource route (kecuali `create`, `show`, `edit`).

| Method | URL | Nama Route | Controller | Keterangan |
|---|---|---|---|---|
| `GET` | `/products` | `products.index` | `ProductController@index` | Halaman manajemen stok |
| `POST` | `/products` | `products.store` | `ProductController@store` | Tambah produk baru |
| `PUT`/`PATCH` | `/products/{product}` | `products.update` | `ProductController@update` | Update produk |
| `DELETE` | `/products/{product}` | `products.destroy` | `ProductController@destroy` | Hapus produk |
| `GET` | `/manajemen-stok` | — | *(redirect)* | Alias → redirect ke `products.index` |

---

## Route Checkout

Semua di-prefix `/checkout` dengan nama `checkout.*`.

| Method | URL | Nama Route | Controller | Keterangan |
|---|---|---|---|---|
| `POST` | `/checkout/confirm` | `checkout.confirm` | `CheckoutController@confirm` | Proses dan simpan transaksi |
| `GET` | `/checkout/{transaction}/receipt` | `checkout.receipt` | `CheckoutController@receipt` | Halaman struk digital |
| `GET` | `/checkout/{transaction}/receipt/pdf` | `checkout.receipt.pdf` | `CheckoutController@downloadPdf` | Download struk PDF |

---

## Route Laporan Penjualan

Semua di-prefix `/laporan-penjualan` dengan nama `sales-report.*`.

| Method | URL | Nama Route | Controller | Keterangan |
|---|---|---|---|---|
| `GET` | `/laporan-penjualan` | `sales-report.index` | `SalesReportController@show` | Halaman laporan utama |
| `GET` | `/laporan-penjualan/summary` | `sales-report.summary` | `SalesReportController@summary` | Data ringkasan (JSON) |
| `GET` | `/laporan-penjualan/chart` | `sales-report.chart` | `SalesReportController@chart` | Data grafik (JSON) |
| `GET` | `/laporan-penjualan/history` | `sales-report.history` | `SalesReportController@history` | Riwayat transaksi (JSON) |
| `GET` | `/laporan-penjualan/pdf` | `sales-report.pdf` | `SalesReportController@downloadPdf` | Download laporan PDF |

---

## Cara Menggunakan Route di Frontend (Wayfinder)

Aplikasi menggunakan **Laravel Wayfinder** untuk type-safe routes di TypeScript. Jangan tulis URL sebagai string mentah di frontend.

```typescript
// ❌ Jangan lakukan ini:
router.post('/checkout/confirm', data)

// ✅ Lakukan ini (type-safe, otomatis update jika route berubah):
import { route } from '@/wayfinder'
router.post(route('checkout.confirm'), data)
```

Wayfinder men-generate ulang type definitions setiap kali `vite` berjalan. File hasil generate ada di `resources/js/wayfinder/` — **jangan edit manual**.

---

## Melihat Semua Route via Artisan

```bash
# Tampil semua route
php artisan route:list

# Filter route yang mengandung kata tertentu
php artisan route:list --filter=checkout
```

---

## Navigasi Dokumentasi

- [← Fitur Aplikasi](./06-features.md)
- [Frontend →](./08-frontend.md)
