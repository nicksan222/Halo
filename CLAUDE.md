# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Read Cursor Rules First

**BEFORE working on any feature**, you MUST read the relevant Cursor rules in `.cursor/rules/` to understand the detailed patterns and conventions:

- **API work**: Read `.cursor/rules/api-usage.mdc` for tRPC patterns, testing, media uploads
- **Database work**: Read `.cursor/rules/db-usage.mdc` for Drizzle ORM, schema patterns, queries  
- **UI components**: Read `.cursor/rules/ui-usage.mdc` for component library, forms, theming
- **Authentication**: Read `.cursor/rules/auth-usage.mdc` for Better Auth patterns, roles
- **File storage**: Read `.cursor/rules/storage-usage.mdc` for Vercel Blob patterns
- **Lists/Tables**: Read `.cursor/rules/list-usage.mdc` for compound components, pagination, filters
- **i18n/Localization**: Read `.cursor/rules/localization-usage.mdc` for translation patterns

These files contain comprehensive examples, patterns, and conventions that are essential for maintaining code quality and consistency.

## Development Commands

This is a Bun monorepo using Turbo for orchestration:

```bash
# Development
bun run dev              # Start all apps in development mode (parallel)

# Building
bun run build           # Build all packages and apps
bun run typecheck       # Type check all packages
bun run check           # Run both typecheck and lint

# Code Quality
bun run lint            # Lint all code with Biome
bun run format          # Format all code with Biome (writes changes)

# Database Operations
bun run db:generate     # Generate Drizzle schema migrations
bun run db:migrate      # Apply pending migrations
bun run db:studio       # Launch Drizzle Studio
bun run db:introspect   # Introspect existing DB to schema
bun run db:check        # Validate config and migrations

# Authentication
bun run auth:db:generate # Generate auth + DB schemas together

# Dependencies
bun run deps:check      # Check for version mismatches with syncpack
bun run deps:fix        # Fix dependency version mismatches
bun run deps:lint       # Lint package.json files

# Seeding
bun run seed           # Reset, migrate, and seed database
```

## Project Architecture

This is a monorepo with three main applications and shared packages:

### Applications (`apps/`)
- **web-trainer** - Next.js 15 trainer application (main app)
- **landing** - Astro landing page  
- **docs** - Next.js documentation site using Fumadocs

### Core Packages (`packages/`)
- **api** - tRPC router with Zod validation (`@ownfit/api`)
- **auth** - Better Auth configuration (`@ownfit/auth`) 
- **db** - Drizzle ORM schemas and client (`@ownfit/db`)
- **ui** - Shared component library with Tailwind (`@ownfit/ui`)
- **localization** - i18n utilities (`@ownfit/localization`)

### Supporting Packages
- **storage** - File upload/storage utilities
- **email** - Email templates and sending
- **testing** - Test utilities and setup builders
- **seeder** - Database seeding utilities
- **enum** - Shared TypeScript enums
- **icons** - Icon components
- **env** - Environment variable validation
- **scripts** - Shared build/utility scripts
- **tailwind-config** - Shared Tailwind configuration

## Import Patterns

The monorepo uses consistent import aliases (defined in cursor rules):

```ts
// Packages (preferred aliases)
import { Button } from '@/ui/button';           // UI components
import { db } from '@/db';                      // Database client
import { auth } from '@/auth';                  // Server-side auth
import { authClient } from '@/auth/client';     // Client-side auth
import { trpc } from '@/api';                   // tRPC client
import { useLocale } from '@ownfit/localization/next-client';

// Direct package imports (fallback if aliases not configured)
import { Button } from '@ownfit/ui/components/button';
import { db } from '@ownfit/db';
import { auth } from '@ownfit/auth';
```

## Key Development Workflows

### When Adding New API Endpoints
1. **First**: Read `.cursor/rules/api-usage.mdc` for complete patterns
2. Create procedure structure: `packages/api/src/procedures/{feature}/{action}/`
3. Define Zod input schema in `input.ts`
4. Implement procedure in `index.ts`
5. Write comprehensive tests following the testing guide
6. Update router composition

### When Working with Database
1. **First**: Read `.cursor/rules/db-usage.mdc` for schema patterns
2. Create/modify schema files in `packages/db/src/schema/`
3. Run `bun run db:generate` to create migrations
4. Run `bun run db:migrate` to apply changes
5. Update types and relations as needed

### When Building UI Components
1. **First**: Read `.cursor/rules/ui-usage.mdc` for component patterns
2. Use existing components from `@/ui/*`
3. Follow form integration patterns with React Hook Form + Zod
4. Use `cn()` utility for conditional styling
5. Implement proper theme support

### When Implementing Authentication
1. **First**: Read `.cursor/rules/auth-usage.mdc` for auth patterns  
2. Use `protectedProcedure` for authenticated API routes
3. Implement role-based access control with `admin`, `vendor`, `customer`
4. Use proper server/client auth imports

### When Adding File Storage
1. **First**: Read `.cursor/rules/storage-usage.mdc` for storage patterns
2. Use scoped storage with `StoragePrefix` for organization
3. Implement server-side CRUD and client-side uploads
4. Configure `BLOB_READ_WRITE_TOKEN` environment variable

## Testing Requirements

- **API Testing**: Follow comprehensive testing guide in `.cursor/rules/api-usage.mdc`
  - Test success cases, errors, validation, different user roles
  - Use `TestSetupBuilder` for consistent test environments
  - Place tests alongside procedures (`success.test.ts`, `error.test.ts`)
- **E2E Testing**: Use Playwright with `bun run test:e2e` 
- **Always test**: Authentication, authorization, input validation, database persistence

## Environment Requirements

- Set `DATABASE_URL` for database operations
- Set `BLOB_READ_WRITE_TOKEN` for storage operations
- Use `NEXT_PUBLIC_API_URL` for client-side API calls
- Auth package requires database connection

## Tech Stack Summary
- **Runtime**: Bun with workspaces
- **Monorepo**: Turbo for task orchestration
- **Frontend**: Next.js 15, React 19, Astro 5
- **Backend**: tRPC with Zod validation, Better Auth
- **Database**: Drizzle ORM + PostgreSQL
- **Storage**: Vercel Blob with prefix scoping
- **UI**: Tailwind CSS, Shadcn/ui components, compound list components
- **Validation**: Zod schemas shared between client/server
- **Testing**: Bun Test, Playwright, TestSetupBuilder for integration tests
- **Code Quality**: Biome (linting/formatting)
- **Localization**: i18n utilities with en/it support

## Development Best Practices

- **Always read relevant cursor rules first** - they contain essential patterns and examples
- **Use TestSetupBuilder** for all API integration tests
- **Follow the established directory structure** for procedures, schemas, and components
- **Reuse Zod schemas** between API input validation and frontend forms
- **Use proper import aliases** to maintain consistency
- **Test all user roles** when implementing authentication
- **Include performance tests** for critical endpoints
- **Follow enum validation patterns** from database schemas in API inputs

Remember: The cursor rules contain the complete, detailed implementation patterns. This file provides the overview and workflow guidance.