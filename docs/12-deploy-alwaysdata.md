# Deploy ke AlwaysData

Panduan ini digunakan untuk deployment Mochimod ID ke AlwaysData. Konfigurasi
Railway seperti `railway.toml` dan `nixpacks.toml` tidak digunakan oleh
AlwaysData.

## 1. Siapkan database

Buat database MySQL di dashboard AlwaysData, lalu catat host, port, nama
database, username, dan password.

## 2. Build frontend di komputer lokal

Jalankan dari root repository:

```powershell
npm install
npm run build
```

Pastikan folder `public/build` sudah terbentuk.

## 3. Upload berkas

Upload project melalui SFTP ke folder seperti:

```text
/home/USERNAME/mochimod
```

Berkas yang perlu di-upload:

```text
app/
bootstrap/
config/
database/
public/
resources/
routes/
storage/
artisan
composer.json
composer.lock
```

Jangan upload `.env` lokal, `node_modules/`, `.git/`, atau database SQLite
lokal. Folder `vendor/` boleh tidak di-upload jika Composer tersedia di
server.

## 4. Buat website

Di AlwaysData, buka **Web > Sites**, buat site bertipe **PHP**, gunakan PHP
8.4, dan atur document root ke:

```text
/home/USERNAME/mochimod/public
```

Document root harus menunjuk ke `public`, bukan ke root project.

## 5. Konfigurasi environment

Di server, jalankan:

```bash
cd ~/mochimod
cp .env.alwaysdata.example .env
nano .env
```

Isi `APP_URL`, `APP_KEY`, kredensial MySQL, QRIS, dan informasi toko. Generate
key hanya untuk instalasi baru:

```bash
php artisan key:generate
```

Jangan mengganti `APP_KEY` pada instalasi production yang sudah memiliki data.

## 6. Jalankan deployment

Jika skrip sudah ikut di-upload:

```bash
cd ~/mochimod
bash scripts/deploy-alwaysdata.sh
```

Atau jalankan perintahnya satu per satu:

```bash
composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction
php artisan migrate --force
php artisan storage:link
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache
chmod -R u+rwX storage bootstrap/cache
```

Skrip deployment tidak menjalankan seeder agar akun atau data production tidak
tertimpa. Jalankan `php artisan db:seed --force` hanya jika memang diperlukan.

## 7. Verifikasi

Buka domain HTTPS dan tes login, upload gambar produk, transaksi, PDF, serta
laporan. Jika terjadi error, lihat log:

```bash
tail -n 100 storage/logs/laravel.log
```
