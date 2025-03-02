#!/bin/bash
set -e

# Clear bootstrap cache
echo "Clearing bootstrap cache..."
rm -f /var/www/html/bootstrap/cache/*.php
mkdir -p /var/www/html/bootstrap/cache
chmod -R 775 /var/www/html/bootstrap/cache

# Fix storage directory permissions
echo "Setting storage directory permissions..."
mkdir -p /var/www/html/storage/framework/views
mkdir -p /var/www/html/storage/framework/cache
mkdir -p /var/www/html/storage/framework/sessions
mkdir -p /var/www/html/storage/logs
chown -R www-data:www-data /var/www/html/storage
chmod -R 775 /var/www/html/storage

# Run migrations without seeders first
echo "Running migrations..."
php artisan migrate --force

# Check if users table has data before running seeders

echo "No users found. Running seeders..."
php artisan db:seed --force

# Start supervisor
echo "Starting supervisor..."
exec "$@" 