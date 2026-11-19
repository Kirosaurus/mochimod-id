#!/usr/bin/env bash
set -euo pipefail

if [ ! -f artisan ]; then
    echo "Jalankan skrip ini dari root project Laravel." >&2
    exit 1
fi

if [ ! -f .env ]; then
    echo "File .env belum ada. Salin .env.alwaysdata.example menjadi .env dan isi nilainya." >&2
    exit 1
fi

composer install --no-dev --optimize-autoloader --prefer-dist --no-interaction
php artisan migrate --force
php artisan storage:link
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

chmod -R u+rwX storage bootstrap/cache

echo "Deployment Laravel selesai."
