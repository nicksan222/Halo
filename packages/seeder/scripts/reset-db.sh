#!/bin/bash
set -e

# Drop and recreate the 'acme' database to wipe all schemas and data
cd "$(dirname "$0")/../../.."

# Ensure services are up (no-op if already running)
docker compose -f .devcontainer/docker-compose.yml up -d > /dev/null 2>&1 || true

# Terminate connections, drop and recreate database
docker compose -f .devcontainer/docker-compose.yml exec -T postgres psql -U postgres -v ON_ERROR_STOP=1 -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname='acme';" && \
docker compose -f .devcontainer/docker-compose.yml exec -T postgres psql -U postgres -c "DROP DATABASE IF EXISTS acme;" && \
docker compose -f .devcontainer/docker-compose.yml exec -T postgres psql -U postgres -c "CREATE DATABASE acme;"

echo "✅ Database reset (acme) completed" 