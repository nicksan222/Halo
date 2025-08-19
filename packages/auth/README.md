# Auth Package

This package provides authentication and authorization functionality using Better Auth.

## File Structure

```
src/
├── auth.ts              # Main auth configuration (kept in root as requested)
├── index.ts             # Main exports
├── access-control/      # Role-based access control
│   ├── index.ts         # Access control exports
│   ├── permissions.ts   # Permission statements and access control setup
│   └── roles/           # Role definitions
│       ├── index.ts     # Role exports
│       ├── admin.ts     # Admin role
│       ├── customer.ts  # Customer role
│       └── vendor.ts    # Vendor role
└── plugins/             # Better Auth plugins
    ├── index.ts         # Plugin exports
    └── client.ts        # Client-side auth configuration
```

## Usage

### Server-side (API)
```typescript
import { auth } from '@acme/auth';
```

### Client-side (React)
```typescript
import { authClient } from '@acme/auth/client';
```

### Access Control
```typescript
import { accessControl, admin, vendor, customer } from '@acme/auth';
```

## Roles

- **Admin**: Full permissions (default Better Auth admin role)
- **Vendor**: Can list users for support purposes
- **Customer**: No admin capabilities

## Configuration

The main auth configuration is in `auth.ts` and includes:
- Database adapter (Drizzle + PostgreSQL)
- Email and password authentication
- Username plugin
- Organization plugin
- Admin plugin with custom roles 