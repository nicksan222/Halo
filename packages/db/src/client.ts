import { env } from '@acme/env';
import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import ws from 'ws';

const connectionString = env.DATABASE_URL;

// Configure Neon for local development via Neon Proxy
if (env.NODE_ENV === 'development') {
  neonConfig.fetchEndpoint = (host) => {
    const [protocol, port] = host === 'db.localtest.me' ? ['http', 4444] : ['https', 443];
    return `${protocol}://${host}:${port}/sql`;
  };
  const connectionStringUrl = new URL(connectionString);
  neonConfig.useSecureWebSocket = connectionStringUrl.hostname !== 'db.localtest.me';
  neonConfig.wsProxy = (host) => (host === 'db.localtest.me' ? `${host}:4444/v2` : `${host}/v2`);
}

neonConfig.webSocketConstructor = ws;

const sql = neon(connectionString);
export const db = drizzle({ client: sql });
