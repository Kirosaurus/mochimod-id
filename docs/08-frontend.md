# Frontend

Panduan untuk memahami dan mengembangkan bagian frontend aplikasi Mochimod ID yang dibangun dengan React, TypeScript, dan Inertia.js.

---

## Teknologi Utama

| Teknologi | Peran |
|---|---|
| **React 19** | Library UI — semua halaman adalah komponen React |
| **TypeScript** | Semua file frontend ditulis `.tsx` / `.ts` |
| **Inertia.js** | Menghubungkan Laravel ke React tanpa REST API |
| **Tailwind CSS v4** | Utility-first styling langsung di JSX |
| **Vite 8** | Bundler + HMR |
| **Laravel Wayfinder** | Type-safe route helpers dari Laravel |

---

## Cara Kerja Inertia.js

Inertia.js adalah "jembatan" antara backend Laravel dan frontend React. Cara kerjanya:

1. User kunjungi URL → Laravel controller dijalankan
2. Controller memanggil `Inertia::render('nama-halaman', ['prop' => $data])`
3. Inertia mengirim JSON response berisi nama komponen + props
4. Di browser, Inertia merender komponen React yang sesuai dengan props tersebut
5. Navigasi selanjutnya (klik link/tombol) dikirim sebagai XHR request, bukan reload penuh → terasa seperti SPA

**Keuntungan:** Developer tidak perlu membangun REST API secara eksplisit. Controller Laravel berfungsi seperti "controller di MVC tradisional", tapi outputnya adalah React component, bukan HTML.

---

## Struktur Direktori `resources/js/`

```
resources/js/
├── app.tsx                 ← Entry point Inertia (jangan ubah kecuali ada kebutuhan khusus)
├── pages/                  ← Satu file = satu halaman (dipanggil oleh Inertia berdasarkan nama)
│   ├── login-page.tsx      ← Halaman login
│   ├── pos.tsx             ← Halaman Point of Sale (halaman utama)
│   ├── product-grid.tsx    ← Grid produk (sub-komponen dari pos.tsx)
│   ├── cart-panel.tsx      ← Panel keranjang belanja (sub-komponen dari pos.tsx)
│   ├── use-cart.tsx        ← Custom React hook untuk state keranjang
│   ├── checkout.tsx        ← Halaman konfirmasi pembayaran
│   ├── receipt.tsx         ← Halaman struk digital
│   ├── sales-report.tsx    ← Halaman laporan penjualan
│   ├── stock-management.tsx ← Halaman manajemen produk & stok
│   └── stock-management/   ← Sub-komponen halaman stock management
├── components/             ← Komponen reusable lintas halaman
│   ├── top-navigation.tsx  ← Navbar atas
│   └── user-popover.tsx    ← Dropdown user (logout, info)
├── layouts/                ← Layout wrapper
├── types/                  ← TypeScript type definitions
│   ├── index.ts            ← Tipe utama: Category, Product, CartItem, StockStatusFilter
│   ├── auth.ts             ← Tipe User dan auth props
│   └── global.d.ts         ← Global type augmentations
├── lib/                    ← Utility/helper functions
├── actions/                ← Inertia form action helpers
└── wayfinder/              ← Auto-generated route helpers (JANGAN edit manual!)
```

---

## TypeScript Types

Semua tipe utama didefinisikan di `resources/js/types/`:

```typescript
// types/index.ts

interface Category {
    id: number;
    name: string;
    description: string | null;
}

interface Product {
    id: number;
    category_id: number;
    name: string;
    description: string | null;
    price: string;         // string karena decimal dari PHP/JSON
    stock: number;
    image: string | null;
    is_active: boolean;
    category: Category;    // relasi eager-loaded
}

interface CartItem {
    product: Product;
    quantity: number;
}

type StockStatusFilter = 'all' | 'safe' | 'low' | 'out';
```

> **Catatan:** `price` bertipe `string` (bukan `number`) karena PHP mengirim nilai decimal sebagai string dalam JSON untuk menjaga presisi. Lakukan konversi ke number saat perlu kalkulasi: `parseFloat(product.price)`.

---

## Panduan: Menambah Halaman Baru

Ikuti langkah-langkah berikut untuk menambah halaman baru dengan Inertia:

### 1. Buat file di `resources/js/pages/`

```tsx
// resources/js/pages/my-new-page.tsx
import { type PageProps } from '@/types'

interface Props {
    myData: string[]
}

export default function MyNewPage({ myData }: Props) {
    return (
        <div>
            {myData.map(item => <p key={item}>{item}</p>)}
        </div>
    )
}
```

### 2. Tambah route di `routes/web.php`

```php
Route::get('/my-new-page', [MyNewController::class, 'show'])->name('my-new-page');
```

### 3. Buat controller (atau tambah method ke controller yang ada)

```php
public function show()
{
    return Inertia::render('my-new-page', [
        'myData' => ['item1', 'item2'],
    ]);
}
```

> **Penting:** Nama pertama argumen `Inertia::render()` harus cocok dengan nama file di `pages/` (tanpa `.tsx`, huruf kecil, menggunakan dash `-`).

---

## Panduan: Navigasi antar Halaman

Gunakan `Link` dari Inertia (bukan `<a href>` biasa):

```tsx
import { Link } from '@inertiajs/react'
import { route } from '@/wayfinder'

// Navigasi ke halaman lain
<Link href={route('POS')}>Kembali ke POS</Link>
```

Untuk navigasi programatik (setelah form submit, dll):

```tsx
import { router } from '@inertiajs/react'
import { route } from '@/wayfinder'

router.visit(route('products.index'))
```

---

## Panduan: Mengirim Form ke Backend

Gunakan `useForm` dari Inertia untuk form yang kompleks:

```tsx
import { useForm } from '@inertiajs/react'
import { route } from '@/wayfinder'

const { data, setData, post, processing, errors } = useForm({
    name: '',
    price: '',
})

function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    post(route('products.store'))
}
```

---

## Wayfinder: Type-safe Routes

Laravel Wayfinder men-generate TypeScript helpers dari semua route Laravel. File hasil generate ada di `resources/js/wayfinder/` dan **tidak boleh diedit manual** — file ini di-regenerate otomatis setiap kali Vite berjalan.

```typescript
// Contoh penggunaan
import { route } from '@/wayfinder'

route('checkout.receipt', { transaction: 42 })
// Output: '/checkout/42/receipt'
```

---

## Navigasi Dokumentasi

- [← Daftar Route](./07-routes.md)
- [Konfigurasi Environment →](./09-environment.md)
