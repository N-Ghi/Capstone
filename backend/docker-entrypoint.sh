#!/bin/sh
set -e

echo "Waiting for PostgreSQL to be ready..."

until pg_isready -h "$AZURE_DB_HOST" -U "$AZURE_DB_USER" 2>/dev/null; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 2
done

echo "PostgreSQL is ready!"

echo "Running database migrations..."
python /app/Urugendo/manage.py migrate --noinput

echo "Seeding database..."
python /app/Urugendo/manage.py seed_reference_data

echo "Starting application..."
exec "$@"