#!/bin/sh
set -e

echo "⏳ Waiting for PostgreSQL..."
# Используем правильный хост (имя сервиса из docker-compose)
until pg_isready -h shop-database -U postgres; do
  sleep 2
done

echo "🚀 Running Prisma migrations..."
# ./node_modules/.bin/prisma migrate deploy
npx prisma migrate deploy

echo "🌱 Running seed script..."
node prisma/dist/seed.js



exec "$@"