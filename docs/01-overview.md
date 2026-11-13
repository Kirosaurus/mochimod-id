# Gambaran Umum — Mochimod ID

## Tentang Project

**Mochimod ID** adalah aplikasi Point of Sale (POS) berbasis web yang dirancang khusus untuk UMKM **Mochimod**, sebuah usaha kecil menengah yang menjual produk mochi dan jus.

Aplikasi ini hadir untuk menggantikan proses pencatatan transaksi yang sebelumnya dilakukan secara manual (tulis tangan atau spreadsheet). Dengan POS ini, kasir dapat memproses transaksi lebih cepat, akurat, dan langsung mendapat laporan penjualan secara real-time.

---

## Pengguna Aplikasi

Aplikasi ini ditujukan untuk **satu peran pengguna**: kasir / admin toko.

Kasir dapat:
- Login ke sistem
- Melihat daftar produk dan melakukan transaksi penjualan
- Memilih metode pembayaran (tunai atau QRIS statis)
- Mencetak atau mengunduh struk transaksi (PDF)
- Mengelola produk dan stok barang
- Melihat laporan penjualan

Tidak ada registrasi publik — akun kasir dibuat langsung oleh administrator melalui seeder atau artisan tinker.

---

## Fitur Utama

### 1. Point of Sale (POS)
Halaman utama setelah login. Kasir memilih produk dari grid berdasarkan kategori, menambahkan ke keranjang, dan memproses transaksi.

### 2. Checkout
Kasir memilih metode pembayaran:
- **Tunai** — input nominal uang diterima, sistem hitung kembalian otomatis
- **QRIS** — kasir memperlihatkan QR Code statis kepada pelanggan; konfirmasi dilakukan secara manual

### 3. Struk Digital
Setelah transaksi selesai, sistem menampilkan struk di browser. Struk juga bisa diunduh sebagai file PDF (format A5).

### 4. Manajemen Produk & Stok
Kasir dapat menambah, mengedit, dan menghapus produk. Setiap produk memiliki nama, kategori, harga, stok, gambar, dan status aktif/nonaktif.

### 5. Laporan Penjualan
Laporan komprehensif yang mencakup:
- **Ringkasan** — total pendapatan, jumlah transaksi, rata-rata nilai transaksi
- **Grafik Tren** — visualisasi penjualan per periode
- **Riwayat Transaksi** — daftar semua transaksi dengan detail item
- **Ekspor PDF** — unduh laporan dalam format PDF

---

## Status Project

| Aspek | Status |
|---|---|
| Pengembangan fitur | ✅ 98% selesai |
| Testing | ✅ Sudah diuji (unit & feature test) |
| Deployment | ⏳ Menunggu verifikasi dosen |

---

## Navigasi Dokumentasi

- [Tech Stack →](./02-tech-stack.md)
- [Cara Instalasi →](./03-getting-started.md)
- [Arsitektur Aplikasi →](./04-architecture.md)
