#!/bin/bash

set -e

echo "🚀 Starting development environment..."

# Verify bun installation
echo "🐰 Verifying bun installation..."
bun --version

# Install dependencies
echo "📚 Installing project dependencies..."
bun install

# Start PostgreSQL using Docker Compose
echo "🐘 Starting PostgreSQL container..."
cd "$(dirname "$0")"
docker compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
until docker compose exec postgres pg_isready -U postgres > /dev/null 2>&1; do
  echo "   PostgreSQL is not ready yet, waiting..."
  sleep 2
done

echo "✅ PostgreSQL is ready!"

# Ensure target database exists (create if missing)
if ! docker compose exec -T postgres psql -U postgres -tAc "SELECT 1 FROM pg_database WHERE datname='acme'" | grep -q 1; then
  echo "   Creating database acme..."
  docker compose exec -T postgres psql -U postgres -c "CREATE DATABASE acme"
fi

# Run database migrations
echo "🔄 Running database migrations..."
cd "$WORKSPACE_ROOT"
bun run db:migrate
echo "✅ Migrations completed!"

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📊 Service Status:"
echo "   🐘 PostgreSQL: localhost:5432"
echo "   🔗 Neon Proxy: localhost:4444"
echo ""
echo "🛑 To stop services, run: docker compose down"
echo "" 