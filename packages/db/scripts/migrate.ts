import { env } from '@acme/env';
import { neon, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

async function main(): Promise<void> {
  const connectionString = env.DATABASE_URL;

  try {
    const dbUrl = new URL(connectionString);
    const host = dbUrl.hostname;

    neonConfig.webSocketConstructor = ws;

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
  const db = drizzle({ client: sql });

  await migrate(db, { migrationsFolder: 'drizzle' });
}

main().then(() => {
  console.log('✅ Migration completed');
}).catch((error) => {
  console.error('❌ Error during migration:', error);
  process.exit(1);
}); 