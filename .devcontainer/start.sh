#!/bin/bash

set -e

# Determine workspace root if not provided
WORKSPACE_ROOT="${WORKSPACE_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"

echo "🚀 Starting development environment..."

# Verify bun installation
echo "🐰 Verifying bun installation..."
bun --version

# Install dependencies
echo "📚 Installing project dependencies..."
cd "$WORKSPACE_ROOT"
bun install

# Install Playwright browsers and dependencies for the web app
echo "🎭 Installing Playwright browsers and dependencies..."
cd "$WORKSPACE_ROOT/apps/web"
bunx --yes playwright install --with-deps
cd "$WORKSPACE_ROOT"

# Start PostgreSQL using Docker Compose
echo "🐘 Starting services (PostgreSQL, Mailpit, MinIO)..."
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

# Reset database (drop and recreate public schema)
echo "🧹 Resetting database (drop and recreate public schema)..."
docker compose exec -T postgres psql -U postgres -d acme -v ON_ERROR_STOP=1 -c "DROP SCHEMA IF EXISTS public CASCADE; DROP SCHEMA IF EXISTS drizzle CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;"

# Run database migrations
echo "🔄 Running database migrations..."
cd "$WORKSPACE_ROOT"
bun run db:migrate
echo "✅ Migrations completed!"

# Seed database
echo "🌱 Seeding database..."
bun run seed
echo "✅ Seeding completed!"

echo ""
echo "🎉 Development environment is ready!"
echo ""
echo "📊 Service Status:"
echo "   🐘 PostgreSQL: localhost:5432"
echo "   🔗 Neon Proxy: localhost:4444"
echo "   ✉️  Mailpit UI: http://localhost:8025 (SMTP: 1025)"
echo "   🗄️  MinIO S3 API: http://localhost:9000 (Console: http://localhost:9001)"
echo ""
echo "🛑 To stop services, run: docker compose down"
echo "" 