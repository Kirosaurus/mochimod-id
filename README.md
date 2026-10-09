# Mochimod ID

Aplikasi web berbasis Laravel untuk Mochimod ID. Saat ini aplikasi menyediakan halaman login dan dashboard untuk pengguna yang sudah terautentikasi.

## Teknologi

- PHP 8.3+
- Laravel 13
- Livewire 4
- Vite 8
- Tailwind CSS 4
- SQLite sebagai database default untuk development

## Instalasi

Pastikan PHP, Composer, dan Node.js sudah terpasang.

```bash
git clone <url-repository>
cd Mochimod-Id
composer run setup
```

`composer run setup` akan memasang dependency, membuat `.env`, membuat application key, menjalankan migration, memasang dependency JavaScript, dan melakukan build asset.

Jika ingin menjalankan langkahnya satu per satu:

```bash
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
npm install
npm run build
```

## Menjalankan Aplikasi

Untuk menjalankan server Laravel dan Vite secara bersamaan:

```bash
composer run dev
```

Aplikasi biasanya tersedia di `http://localhost:8000`.

Untuk menjalankan Vite saja:

```bash
npm run dev
```

## Testing

```bash
composer test
```

Atau:

```bash
php artisan test
```

## Alur Git dengan Branch Sendiri

Buat branch pribadi dari branch utama, misalnya `feature/nama-fitur`:

```bash
git switch main
git pull origin main
git switch -c feature/nama-fitur
```

Setelah selesai mengerjakan perubahan:

```bash
git status
git add .
git commit -m "feat: jelaskan perubahan"
git push -u origin feature/nama-fitur
```

Perintah `-u` menghubungkan branch lokal dengan branch di GitHub. Push berikutnya cukup menggunakan:

```bash
git push
```

Setelah branch berhasil dikirim, buka repository di GitHub lalu buat Pull Request dari `feature/nama-fitur` ke `main`.

## Catatan

- Jangan commit file `.env` karena berisi konfigurasi lokal dan data rahasia.
- Sebelum commit, periksa perubahan dengan `git status` dan `git diff`.
- Gunakan nama branch yang menjelaskan pekerjaan, misalnya `feature/login`, `fix/session`, atau `docs/readme`.
