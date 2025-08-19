# iTravelFree Development Container

This devcontainer automatically sets up a development environment for the iTravelFree project.

## 🚀 Automatic Startup

When you open this workspace in a devcontainer, the following will automatically happen:

1. **🐘 PostgreSQL Database** - Running on port 5432
2. **🔄 Database Migrations** - Automatically run to set up the database schema

## 📋 Available Commands

### Service Management

```bash
# Start PostgreSQL and run migrations
./.devcontainer/start-services.sh

# Stop PostgreSQL
./.devcontainer/stop-services.sh
```

### Database Commands

```bash
# Generate database schema
bun run db:generate

# Run database migrations
bun run db:migrate

# Open Drizzle Studio (if needed)
bun run db:studio

# Check database schema
bun run db:check
```

### Development Commands

```bash
# Start all apps in development mode
bun run dev

# Build all packages
bun run build

# Lint code
bun run lint

# Format code
bun run format
```

## 🔧 Service Details

### PostgreSQL Database
- **Host**: localhost
- **Port**: 5432
- **Database**: acme
- **Username**: postgres
- **Password**: postgres
- **Connection URL**: `postgresql://postgres:postgres@localhost:5432/acme`

## 🐛 Troubleshooting

### Database not starting?
1. Check if Docker is running: `docker ps`
2. Check PostgreSQL container: `docker ps | grep postgres`
3. Restart services: `./.devcontainer/stop-services.sh && ./.devcontainer/start-services.sh`

### Database connection issues?
1. Ensure PostgreSQL container is running: `docker ps | grep postgres`
2. Check database health: `docker exec devcontainer-postgres-1 pg_isready -U postgres`
3. Restart services: `./.devcontainer/stop-services.sh && ./.devcontainer/start-services.sh`

### Port conflicts?
The devcontainer forwards port 5432 (PostgreSQL). Make sure this port is available on your host machine.

## 📁 Project Structure

```
acme/
├── apps/
│   ├── api/          # Backend API server
│   └── web/          # Frontend web application
├── packages/
│   ├── db/           # Database schema and client
│   ├── auth/         # Authentication package
│   ├── api/          # API utilities
│   └── ui/           # Shared UI components
└── .devcontainer/    # Development container configuration
```

## 🔄 Rebuilding the Container

If you need to rebuild the devcontainer:

1. Open Command Palette (Ctrl/Cmd + Shift + P)
2. Select "Dev Containers: Rebuild Container"
3. Wait for the rebuild to complete
4. PostgreSQL will automatically start and migrations will run

## 📝 Notes

- PostgreSQL runs in the background and restarts automatically when the container starts
- Database migrations run automatically on container startup
- The database data persists between container restarts
- For database management, you can manually run `bun run db:studio` when needed 