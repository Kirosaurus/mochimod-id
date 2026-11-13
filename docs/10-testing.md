# Testing

Panduan untuk menjalankan dan menulis test di project Mochimod ID. Project ini menggunakan **Pest PHP** sebagai framework testing.

---

## Menjalankan Test

### Semua Test (Rekomendasi)

```bash
composer test
```

Perintah ini menjalankan secara berurutan:
1. Config cache dibersihkan
2. `pint --parallel --test` — cek code style (tanpa mengubah file)
3. `phpstan analyse` — static analysis
4. `php artisan test` — semua unit & feature test

### Hanya Unit & Feature Test

```bash
php artisan test
```

Atau dengan Pest langsung:

```bash
./vendor/bin/pest
```

### Test Spesifik

```bash
# Jalankan satu test class
php artisan test --filter SalesReportServiceTest

# Jalankan satu method/test case
php artisan test --filter "it calculates daily revenue"

# Hanya Unit test
php artisan test tests/Unit

# Hanya Feature test
php artisan test tests/Feature
```

### Dengan Output Detail

```bash
php artisan test --verbose
```

---

## Struktur Test

```
tests/
├── Pest.php                            ← Konfigurasi global Pest (helper, expectation, dll)
├── TestCase.php                        ← Base test case
├── Unit/
│   ├── ExampleTest.php                 ← Contoh test bawaan Laravel (placeholder)
│   └── SalesReportServiceTest.php      ← Test komprehensif logika laporan penjualan
└── Feature/
    ├── ExampleTest.php                 ← Contoh test bawaan Laravel (placeholder)
    ├── SalesReportControllerTest.php   ← Test HTTP endpoint laporan penjualan
    └── ConvertUtcToWibTest.php         ← Test migrasi konversi timezone UTC ke WIB
```

---

## Deskripsi Test yang Ada

### `tests/Unit/SalesReportServiceTest.php`
Test unit terbesar di project (25KB+). Menguji semua metode di `SalesReportService` secara terisolasi tanpa HTTP overhead.

Contoh cakupan:
- Kalkulasi total pendapatan per periode
- Filter berdasarkan tanggal
- Perhitungan produk terlaris per kategori
- Generasi data time-series untuk grafik
- Penanganan edge case (tidak ada transaksi, periode kosong, dll)

### `tests/Feature/SalesReportControllerTest.php`
Test feature untuk semua endpoint laporan penjualan:
- `GET /laporan-penjualan` — halaman utama
- `GET /laporan-penjualan/summary` — data ringkasan
- `GET /laporan-penjualan/chart` — data grafik
- `GET /laporan-penjualan/history` — riwayat transaksi
- `GET /laporan-penjualan/pdf` — download PDF

### `tests/Feature/ConvertUtcToWibTest.php`
Test yang memverifikasi bahwa migrasi konversi timezone (UTC → WIB) berjalan dengan benar dan data timestamp tersimpan dalam format yang tepat.

---

## Menulis Test Baru

### Unit Test

Gunakan untuk menguji logika bisnis murni tanpa melibatkan database atau HTTP.

```php
// tests/Unit/ContohTest.php
<?php

test('contoh unit test', function () {
    // Arrange
    $input = 10000;

    // Act
    $result = hitungDiskon($input, 10);

    // Assert
    expect($result)->toBe(9000);
});
```

### Feature Test

Gunakan untuk menguji interaksi HTTP lengkap termasuk database.

```php
// tests/Feature/ContohFeatureTest.php
<?php

use App\Models\User;
use App\Models\Product;
use App\Models\Category;

test('kasir bisa melihat halaman POS', function () {
    // Arrange: buat user dan login
    $user = User::factory()->create();

    // Act: kirim request sebagai user yang sudah login
    $response = $this->actingAs($user)->get('/');

    // Assert: halaman berhasil dimuat
    $response->assertStatus(200)
             ->assertInertia(fn ($page) => $page->component('pos'));
});

test('checkout berhasil mengurangi stok produk', function () {
    $user = User::factory()->create();
    $category = Category::factory()->create();
    $product = Product::factory()->create([
        'category_id' => $category->id,
        'stock' => 10,
        'price' => 15000,
        'is_active' => true,
    ]);

    $response = $this->actingAs($user)->post('/checkout/confirm', [
        'payment_method' => 'cash',
        'amount_paid' => 20000,
        'items' => [
            ['product_id' => $product->id, 'quantity' => 2]
        ]
    ]);

    $response->assertRedirect();
    expect($product->fresh()->stock)->toBe(8); // 10 - 2
});
```

### Tips Menulis Test

1. **Gunakan factory** untuk membuat data dummy:
   ```bash
   # Lihat factory yang tersedia
   ls database/factories/
   ```

2. **Gunakan `actingAs()`** untuk simulasi user yang sudah login:
   ```php
   $this->actingAs(User::factory()->create())
   ```

3. **Isolasi test** — setiap test harus independen. Gunakan `RefreshDatabase` trait untuk reset database antar test:
   ```php
   // Sudah dikonfigurasi di tests/Pest.php
   uses(Tests\TestCase::class)->in('Feature');
   ```

4. **Nama test yang deskriptif** — gunakan format "it [melakukan sesuatu]":
   ```php
   test('it redirects unauthenticated users to login', ...)
   test('it decrements stock after successful checkout', ...)
   ```

---

## Quality Tools Lainnya

### PHP Code Style (Laravel Pint)

```bash
# Cek style tanpa mengubah file
composer lint:check

# Auto-fix code style
composer lint
```

### PHP Static Analysis (Larastan / PHPStan)

```bash
# Jalankan static analysis
composer types:check
```

Konfigurasi Larastan ada di `phpstan.neon`.

### TypeScript Type Check

```bash
# Cek tipe TypeScript
npm run types:check
```

### ESLint / Code Check Frontend

```bash
# Cek dan auto-fix
npm run check
npm run check:fix
```

### Jalankan Semua Checks Sekaligus (CI)

```bash
composer ci:check
```

Perintah ini menjalankan: ESLint + TypeScript check + semua test PHP.

---

## Navigasi Dokumentasi

- [← Konfigurasi Environment](./09-environment.md)
- [Panduan Kontribusi →](./11-contributing.md)
