import { existsSync } from 'node:fs';
import { env } from '@acme/env';
import { neon, neonConfig } from '@neondatabase/serverless';
import type { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { drizzle as drizzlePg } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import ws from 'ws';

const connectionString = env.DATABASE_URL;

function isLocalHost(host: string): boolean {
  const hostOnly = host.split(':')[0];
  return hostOnly === 'db.localtest.me' || hostOnly === 'localhost' || hostOnly === '127.0.0.1';
}

function buildLocalPostgresConnectionString(dbUrl: URL): string {
  const username = decodeURIComponent(dbUrl.username || 'postgres');
  const password = decodeURIComponent(dbUrl.password || 'postgres');
  const database = dbUrl.pathname.replace(/^\//, '') || 'acme';
  const runningInContainer = existsSync('/.dockerenv');
  const host = runningInContainer ? 'host.docker.internal' : 'localhost';
  return `postgres://${username}:${password}@${host}:5432/${database}`;
}

const dbUrl = new URL(connectionString);
let db: NeonHttpDatabase<any> | PostgresJsDatabase<any>;

if (isLocalHost(dbUrl.hostname)) {
  const localConn = buildLocalPostgresConnectionString(dbUrl);
  const client = postgres(localConn, { max: 1 });
  db = drizzlePg(client);
} else {
  neonConfig.webSocketConstructor = ws;
  neonConfig.fetchEndpoint = (host) => {
    const hostOnly = host.split(':')[0];
    return isLocalHost(host) ? `http://${hostOnly}:4444/sql` : `https://${host}:443/sql`;
  };
  neonConfig.wsProxy = (host) => {
    const hostOnly = host.split(':')[0];
    return isLocalHost(host) ? `${hostOnly}:4444/v2` : `${host}/v2`;
  };
  (neonConfig as unknown as Record<string, unknown>).poolQueryViaFetch = true;

  const sql = neon(connectionString);
  db = drizzleNeon({ client: sql });
}

export { db };
