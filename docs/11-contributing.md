# Panduan Kontribusi

Panduan untuk developer yang ingin berkontribusi atau melakukan update pada project Mochimod ID. Ikuti panduan ini agar kode tetap konsisten dan mudah di-review.

---

## Prasyarat Sebelum Mulai

Pastikan sudah mengikuti panduan [Getting Started](./03-getting-started.md) dan aplikasi berjalan dengan baik di lokal.

---

## Alur Kerja Git

### 1. Update Branch Utama

Sebelum mulai mengerjakan apapun, pastikan branch `main` lokal sudah up-to-date:

```bash
git switch main
git pull origin main
```

### 2. Buat Branch Baru

Buat branch dari `main` dengan nama yang deskriptif:

```bash
git switch -c feature/nama-fitur
# atau
git switch -c fix/nama-bug
# atau
git switch -c docs/nama-dokumen
```

### 3. Kerjakan Perubahan

Lakukan perubahan, kemudian commit secara bertahap:

```bash
git status               # cek file yang berubah
git add .                # stage semua perubahan
git commit -m "feat: tambah filter kategori di laporan penjualan"
```

### 4. Push ke Remote

```bash
git push -u origin feature/nama-fitur
```

Flag `-u` menghubungkan branch lokal dengan remote. Push berikutnya cukup:

```bash
git push
```

### 5. Buat Pull Request

Buka repository di GitHub, lalu buat Pull Request dari `feature/nama-fitur` ke `main`. Tambahkan deskripsi yang jelas tentang perubahan yang dilakukan.

---

## Konvensi Penamaan Branch

| Tipe | Format | Contoh |
|---|---|---|
| Fitur baru | `feature/nama-fitur` | `feature/filter-tanggal-laporan` |
| Perbaikan bug | `fix/nama-bug` | `fix/stok-negatif-saat-checkout` |
| Dokumentasi | `docs/nama-dokumen` | `docs/panduan-deployment` |
| Refactor | `refactor/nama` | `refactor/sales-report-service` |
| Test | `test/nama-test` | `test/checkout-controller` |

---

## Konvensi Commit Message

Gunakan format **Conventional Commits**:

```
<type>: <deskripsi singkat dalam bahasa Indonesia>
```

| Type | Kapan digunakan |
|---|---|
| `feat` | Menambah fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Perubahan dokumentasi saja |
| `refactor` | Refactor kode tanpa menambah fitur atau fix bug |
| `test` | Menambah atau mengubah test |
| `style` | Perubahan formatting, whitespace (tidak ada perubahan logika) |
| `chore` | Maintenance: update dependency, konfigurasi, dll |

**Contoh commit message yang baik:**
```
feat: tambah filter per kategori di laporan penjualan
fix: stok tidak berkurang setelah checkout QRIS
docs: tambah panduan deployment ke VPS
test: tambah unit test untuk perhitungan kembalian
refactor: pisahkan logika filter ke method tersendiri di SalesReportService
```

---

## Konvensi Kode PHP

### Code Style

Project menggunakan **Laravel Pint** untuk enforcing code style (PSR-12). Jalankan sebelum commit:

```bash
# Auto-fix
composer lint

# Hanya cek (tanpa ubah file)
composer lint:check
```

### Static Analysis

Jalankan **Larastan** untuk menemukan potensi bug:

```bash
composer types:check
```

### Hal-hal yang Perlu Diperhatikan

- **Gunakan Form Request** untuk validasi input, bukan `$request->validate()` langsung di controller
- **Pisahkan logika kompleks ke Service class** — controller sebaiknya hanya berisi logika HTTP (menerima request, panggil service/model, return response)
- **Gunakan Eloquent relationship** alih-alih query manual
- **Tambahkan PHPDoc** pada method yang parameter atau return type-nya kompleks

---

## Konvensi Kode TypeScript/React

### Code Check

Jalankan sebelum commit:

```bash
# Cek dan fix otomatis
npm run check:fix

# Hanya cek
npm run check

# Type check saja
npm run types:check
```

### Hal-hal yang Perlu Diperhatikan

- **Gunakan TypeScript strict** — jangan pakai `any` kecuali tidak ada pilihan lain
- **Komponen React sebagai functional component** dengan hooks — tidak ada class component
- **Gunakan Wayfinder** untuk URL route, bukan string mentah
- **Deklarasikan type untuk semua props** — tambah interface atau type alias
- **Import type** untuk type-only imports:
  ```typescript
  import { type Product } from '@/types'
  ```

---

## Konvensi Penamaan

### Database

| Hal | Konvensi | Contoh |
|---|---|---|
| Nama tabel | `snake_case`, jamak | `transaction_items` |
| Nama kolom | `snake_case` | `product_name`, `is_active` |
| Foreign key | `{nama_tabel_tunggal}_id` | `category_id`, `user_id` |
| Nama migrasi | `{tanggal}_{aksi}_{tabel}.php` | `2026_10_02_023402_create_categories_table.php` |

### PHP

| Hal | Konvensi | Contoh |
|---|---|---|
| Class | `PascalCase` | `SalesReportService`, `CheckoutController` |
| Method | `camelCase` | `generateCode()`, `downloadPdf()` |
| Variable | `camelCase` | `$totalAmount`, `$transactionCode` |
| Constant | `SCREAMING_SNAKE_CASE` | `MAX_ITEMS` |

### TypeScript/React

| Hal | Konvensi | Contoh |
|---|---|---|
| Komponen React | `PascalCase` | `CartPanel`, `TopNavigation` |
| Fungsi/hook | `camelCase` | `useCart()`, `formatCurrency()` |
| File komponen | `kebab-case.tsx` | `cart-panel.tsx`, `top-navigation.tsx` |
| Interface/Type | `PascalCase` | `CartItem`, `StockStatusFilter` |
| Variable/prop | `camelCase` | `totalAmount`, `isActive` |

---

## Checklist Sebelum Pull Request

Pastikan semua item berikut terpenuhi sebelum membuat Pull Request:

- [ ] `composer lint:check` tidak ada error (atau sudah di-fix dengan `composer lint`)
- [ ] `composer types:check` tidak ada error
- [ ] `npm run check` tidak ada error
- [ ] `npm run types:check` tidak ada error
- [ ] `php artisan test` semua test passed
- [ ] Tidak ada file `.env` atau kredensial yang ikut ter-commit
- [ ] Deskripsi Pull Request jelas menjelaskan apa yang diubah dan mengapa

---

## Navigasi Dokumentasi

- [← Testing](./10-testing.md)
- [Kembali ke README →](../README.md)
