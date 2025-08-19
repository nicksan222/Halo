# Environment Package

This package provides centralized environment variable validation and access using [Envalid](https://github.com/af/envalid).

## Features

- **Type-safe environment variables**: All environment variables are validated and typed
- **Centralized configuration**: Single source of truth for all environment variables
- **Development defaults**: Sensible defaults for development environments
- **Runtime validation**: Environment variables are validated at startup

## Usage

### Import the validated environment

```typescript
import { env } from '@acme/env';

// Access validated environment variables
const port = env.PORT; // number
const databaseUrl = env.DATABASE_URL; // string
const isDev = env.isDev; // boolean
```

### Environment Variables

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `NODE_ENV` | `'development' \| 'test' \| 'production' \| 'staging'` | - | Runtime environment |
| `DATABASE_URL` | `string` | `postgres://postgres:postgres@db.localtest.me:5432/acme` (dev) | PostgreSQL connection string |
| `PORT` | `number` | `3001` | API server port |
| `CORS_ORIGIN` | `string` | `http://localhost:3000` | Allowed CORS origin for API |
| `NEXT_PUBLIC_API_URL` | `string` | `http://localhost:3001` | Public base URL for API |

### Environment Helpers

The package provides convenient boolean helpers for environment checking:

```typescript
import { env } from '@acme/env';

if (env.isDev) {
  // Development-specific code
}

if (env.isProduction) {
  // Production-specific code
}

if (env.isTest) {
  // Test-specific code
}
```

## Configuration

### Development Environment

For local development, the package automatically provides sensible defaults:

- `DATABASE_URL` defaults to the local PostgreSQL instance
- `PORT` defaults to 3001
- `CORS_ORIGIN` defaults to `http://localhost:3000`

### Production Environment

In production, ensure all required environment variables are set:

```bash
# Required for production
DATABASE_URL=postgresql://user:pass@host:port/db

# Optional (with defaults)
PORT=3001
CORS_ORIGIN=https://yourdomain.com
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
```

## Integration

This package is used by:

- `@acme/db` - Database connection configuration
- `@acme/auth` - Authentication configuration
- `apps/api` - Server configuration and CORS settings

## Error Handling

If required environment variables are missing or invalid, the application will:

1. Log detailed error messages
2. Exit with code 1 (in Node.js environments)
3. Throw an error (in browser environments)

## Adding New Environment Variables

To add a new environment variable:

1. Add the validator to `src/index.ts`
2. Update this README with the new variable
3. Set appropriate defaults and validation rules
4. Update any consuming packages

Example:

```typescript
// In src/index.ts
export const env = cleanEnv(process.env, {
  // ... existing variables
  NEW_VARIABLE: str({ 
    desc: 'Description of the new variable',
    default: 'default-value' 
  }),
});
``` 