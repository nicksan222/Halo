/**
 * Database migration entrypoint for CI and local development.
 *
 * This script chooses the safest driver for the current environment and applies
 * Drizzle SQL migrations from the `drizzle/` folder.
 *
 * Behavior
 * - Local/CI (localhost, 127.0.0.1, db.localtest.me):
 *   Uses the Postgres.js driver directly against the Docker Postgres on 5432
 *   to avoid SNI/WS proxy issues. This path mirrors how the app talks to
 *   Postgres in a serverful environment and is resilient in CI.
 * - Remote Neon/Supabase/Vercel Postgres URLs:
 *   Uses the Neon HTTP driver via `drizzle-orm/neon-http`, and configures
 *   `neonConfig` when needed.
 *
 * Inputs
 * - env.DATABASE_URL: Full Postgres connection string
 *
 * Outputs
 * - Applies pending migrations and exits with code 0 on success. On failure,
 *   prints a helpful error and exits with code 1.
 */
import { env } from '@acme/env';
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { migrate as migrateNeon } from 'drizzle-orm/neon-http/migrator';
import postgres from 'postgres';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import { migrate as migratePg } from 'drizzle-orm/postgres-js/migrator';

/**
 * Apply migrations using Postgres.js against the local Docker Postgres.
 *
 * Why
 * - Avoids WebSocket/SNI requirements of serverless drivers in CI.
 * - Ensures migrations can run before any HTTP/WS proxy is healthy.
 *
 * Assumptions
 * - A Postgres instance is reachable on localhost:5432
 * - `dbUrl` may contain credentials and database name which are reused
 */
async function migrateLocal(dbUrl: URL): Promise<void> {
  const username = decodeURIComponent(dbUrl.username || 'postgres');
  const password = decodeURIComponent(dbUrl.password || 'postgres');
  const database = dbUrl.pathname.replace(/^\//, '') || 'acme';
  const localConn = `postgres://${username}:${password}@localhost:5432/${database}`;

  const client = postgres(localConn, { max: 1 });
  const db = drizzlePg(client);
  await migratePg(db, { migrationsFolder: 'drizzle' });
  await client.end();
}

/**
 * Apply migrations to a remote (serverless) Postgres using the Neon HTTP driver.
 *
 * Notes
 * - For local-like hosts (db.localtest.me/localhost/127.0.0.1) we map the
 *   Neon config to port 4444 for both HTTP and WS to match the local Neon proxy.
 * - Sets a WebSocket constructor for Node runtimes.
 */
async function migrateRemote(connectionString: string): Promise<void> {
  try {
    const dbUrl = new URL(connectionString);
    const host = dbUrl.hostname;

    neonConfig.webSocketConstructor = ws;

    /**
     * Local proxy mapping
     * When the hostname is local, force neonConfig to target the local
     * Neon HTTP proxy on port 4444 so both HTTP and WS connection modes
     * retain the intended port.
     */
    if (host === 'db.localtest.me' || host === 'localhost' || host === '127.0.0.1') {
      neonConfig.useSecureWebSocket = false;
      neonConfig.fetchEndpoint = (h) => {
        const isLocal = h === 'db.localtest.me' || h === 'localhost' || h === '127.0.0.1';
        return isLocal ? `http://${h}:4444/sql` : `https://${h}:443/sql`;
      };
      neonConfig.wsProxy = (h) => {
        const isLocal = h === 'db.localtest.me' || h === 'localhost' || h === '127.0.0.1';
        return isLocal ? `${h}:4444/v2` : `${h}/v2`;
      };
      (neonConfig as unknown as Record<string, unknown>)["poolQueryViaFetch"] = true;
    }
  } catch {
    // Ignore URL parsing issues; env validation would have failed earlier in most cases
  }

  const sql = neon(connectionString);
  const db = drizzleNeon({ client: sql });
  await migrateNeon(db, { migrationsFolder: 'drizzle' });
}

/**
 * Orchestrates driver selection and runs migrations.
 *
 * Strategy
 * - If DATABASE_URL points to a local host, use Postgres.js on 5432.
 * - Otherwise, configure Neon (when necessary) and use neon-http.
 */
async function main(): Promise<void> {
  const connectionString = env.DATABASE_URL;
  const dbUrl = new URL(connectionString);
  const host = dbUrl.hostname;

  // Local-first: direct TCP to Postgres avoids serverless constraints in CI.
  if (host === 'localhost' || host === '127.0.0.1' || host === 'db.localtest.me') {
    await migrateLocal(dbUrl);
    return;
  }

  // Remote: prefer Neon HTTP migrator with appropriate configuration.
  await migrateRemote(connectionString);
}

main().then(() => {
  console.log('✅ Migration completed');
}).catch((error) => {
  console.error('❌ Error during migration:', error);
  process.exit(1);
}); 