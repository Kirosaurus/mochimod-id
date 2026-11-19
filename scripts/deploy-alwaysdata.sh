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
php artisan migrate:status
php artisan storage:link --force
php artisan optimize:clear
php artisan config:cache
php artisan route:cache
php artisan view:cache

if [ -f storage/logs/laravel.log ]; then
    echo "=== Laravel log terakhir ==="
    tail -n 80 storage/logs/laravel.log
fi

echo "Deployment Laravel selesai."
