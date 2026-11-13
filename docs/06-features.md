# Fitur Aplikasi

Penjelasan detail setiap fitur dari sudut pandang developer — file mana yang terlibat, bagaimana alurnya, dan hal-hal teknis yang perlu diketahui.

---

## 1. Autentikasi

**File terkait:**
- `app/Http/Controllers/AuthController.php`
- `resources/js/pages/login-page.tsx`
- `routes/web.php` (route `/login`)

**Alur:**
1. User mengakses `/login` → `AuthController::show()` merender halaman `login-page.tsx`
2. User submit form → `POST /login` → `AuthController::login()`
3. Controller validasi credentials dengan `Auth::attempt()`
4. Jika berhasil: session dibuat, redirect ke `/` (halaman POS)
5. Jika gagal: Inertia mengembalikan error ke form

**Catatan teknis:**
- Session disimpan di database (`SESSION_DRIVER=database`)
- Tidak ada fitur "lupa password" atau registrasi publik
- Semua route selain `/login` dilindungi middleware `auth`

---

## 2. Point of Sale (POS)

**File terkait:**
- `app/Http/Controllers/PosController.php`
- `resources/js/pages/pos.tsx`
- `resources/js/pages/product-grid.tsx`
- `resources/js/pages/cart-panel.tsx`
- `resources/js/pages/use-cart.tsx` *(custom hook)*

**Alur:**
1. Kasir login → redirect ke `/` → `PosController::show()`
2. Controller mengirim daftar produk aktif (beserta kategorinya) ke halaman `pos.tsx`
3. `pos.tsx` merender `ProductGrid` di kiri dan `CartPanel` di kanan
4. Kasir klik produk → masuk keranjang (state dikelola hook `useCart`)
5. Kasir atur jumlah, lalu klik "Proses Pembayaran" → pindah ke halaman `checkout.tsx`

**State management:**
- Keranjang belanja dikelola dengan React state lokal via custom hook `use-cart.tsx`
- Tidak ada global state manager (Redux/Zustand) — cukup `useState` + prop drilling ke `CartPanel`

---

## 3. Checkout

**File terkait:**
- `app/Http/Controllers/CheckoutController.php`
- `app/Http/Requests/CheckoutRequest.php`
- `resources/js/pages/checkout.tsx`

**Alur:**
1. Kasir memilih metode bayar: **Tunai** atau **QRIS**
2. Jika tunai: kasir input nominal uang diterima; sistem hitung kembalian secara real-time di frontend
3. Kasir klik "Konfirmasi" → `POST /checkout/confirm`
4. `CheckoutController::confirm()` memvalidasi ulang di server:
   - Semua produk ada di database?
   - Semua produk masih aktif?
   - Stok semua produk mencukupi?
   - Jika tunai: uang yang diterima ≥ total?
5. Jika valid → simpan ke database dalam satu `DB::transaction`
6. Cache laporan di-flush
7. Redirect ke halaman struk

**Keamanan stok (race condition prevention):**
Produk diambil dengan `lockForUpdate()` dalam database transaction, sehingga jika dua kasir checkout produk yang sama secara bersamaan, stok tidak menjadi negatif.

**Snapshot data transaksi:**
Nama produk, harga, dan kategori disalin ke `transaction_items` saat checkout. Jika produk dihapus atau harganya berubah setelah transaksi, riwayat transaksi tetap akurat.

---

## 4. Struk Digital

**File terkait:**
- `app/Http/Controllers/CheckoutController.php` (`receipt`, `downloadPdf`)
- `resources/js/pages/receipt.tsx`
- `resources/views/receipts/pdf.blade.php`

**Alur (browser):**
1. Setelah checkout berhasil → redirect ke `GET /checkout/{transaction}/receipt`
2. `CheckoutController::receipt()` memuat data transaksi + items + user
3. Controller memastikan hanya kasir yang membuat transaksi ini yang bisa mengaksesnya (`abort_unless($transaction->user_id === Auth::id(), 403)`)
4. Inertia merender `receipt.tsx` dengan data transaksi

**Alur (PDF):**
1. Kasir klik "Unduh PDF" → `GET /checkout/{transaction}/receipt/pdf`
2. `CheckoutController::downloadPdf()` generate PDF dengan DomPDF
3. Template: `resources/views/receipts/pdf.blade.php`
4. Format kertas: A5 portrait
5. Nama file: `nota-TRX-YYYYMMDD-XXXX.pdf`

**Konfigurasi toko di PDF:**
Nama toko, alamat, dan nomor telepon diambil dari variabel environment:
```
STORE_NAME=Mochimod
STORE_ADDRESS=Jl. ...
STORE_PHONE=08xx...
```

---

## 5. Manajemen Produk & Stok

**File terkait:**
- `app/Http/Controllers/ProductController.php`
- `app/Http/Requests/StoreProductRequest.php`
- `app/Http/Requests/UpdateProductRequest.php`
- `resources/js/pages/stock-management.tsx`
- `resources/js/pages/stock-management/` *(sub-komponen)*

**Operasi CRUD:**

| Operasi | Method | URL | Keterangan |
|---|---|---|---|
| Lihat daftar | GET | `/products` | Tampil semua produk + kategori |
| Tambah produk | POST | `/products` | Upload gambar opsional |
| Edit produk | PUT/PATCH | `/products/{id}` | Ganti gambar akan hapus gambar lama |
| Hapus produk | DELETE | `/products/{id}` | Gambar dihapus dari storage |

**Upload gambar:**
- Gambar disimpan di `storage/app/public/products/`
- Pastikan storage sudah di-link: `php artisan storage:link`
- Gambar lama otomatis dihapus saat diupdate/produk dihapus

**Filter stok:**
Frontend mendukung filter berdasarkan status stok:
- `all` — semua produk
- `safe` — stok aman
- `low` — stok hampir habis
- `out` — stok habis

---

## 6. Laporan Penjualan

**File terkait:**
- `app/Http/Controllers/SalesReportController.php`
- `app/Services/SalesReportService.php`
- `resources/js/pages/sales-report.tsx`
- `resources/views/reports/` *(template PDF)*

**Halaman laporan** (`/laporan-penjualan`) memiliki beberapa tab/section yang masing-masing fetch data secara terpisah:

### Summary (`/laporan-penjualan/summary`)
Mengembalikan JSON dengan:
- Total pendapatan dalam periode
- Jumlah transaksi
- Rata-rata nilai transaksi
- Produk/kategori terlaris

### Chart (`/laporan-penjualan/chart`)
Mengembalikan data time-series untuk grafik tren penjualan per hari/minggu/bulan.

### History (`/laporan-penjualan/history`)
Mengembalikan daftar transaksi dengan pagination dan detail item.

### Download PDF (`/laporan-penjualan/pdf`)
Generate PDF laporan menggunakan DomPDF. Template di `resources/views/reports/`.

**Caching:**
`SalesReportService` mengimplementasikan caching untuk menghindari query berat yang berulang. Cache di-flush otomatis setiap kali ada transaksi baru melalui `CheckoutController`.

**Filter yang didukung:**
- Periode: harian, mingguan, bulanan, kustom (pilih rentang tanggal)
- Kategori produk

---

## Navigasi Dokumentasi

- [← Database & Model](./05-database.md)
- [Daftar Route →](./07-routes.md)
