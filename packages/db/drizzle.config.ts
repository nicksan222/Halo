import { env } from '@acme/env';
import { defineConfig } from 'drizzle-kit';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon for local/CI when using a local proxy (e.g., localhost:4444 or db.localtest.me)
try {
	const dbUrl = new URL(env.DATABASE_URL);
	const isLocalHost = dbUrl.hostname === 'localhost' || dbUrl.hostname === '127.0.0.1' || dbUrl.hostname === 'db.localtest.me';
	const hasExplicitPort = Boolean(dbUrl.port);
	const port = dbUrl.port || '';

	// Always set ws constructor in Node environments
	neonConfig.webSocketConstructor = ws;

	if (isLocalHost || port === '4444') {
		const hostWithPort = `${dbUrl.hostname}${hasExplicitPort ? `:${dbUrl.port}` : ''}`;
		// Use insecure WS for local proxies and ensure the proxy keeps the port
		neonConfig.useSecureWebSocket = false;
		neonConfig.wsProxy = () => `${hostWithPort}/v2`;
		// Route HTTP queries through the local proxy as well
		neonConfig.fetchEndpoint = `http://${hostWithPort}/sql`;
		// Prefer HTTP for pool queries when available to avoid WS port stripping issues
		((neonConfig as unknown) as Record<string, unknown>)["poolQueryViaFetch"] = true;
	}
} catch {
	// Ignore URL parse errors; drizzle-kit will surface a proper error later
}

export default defineConfig({
  schema: ['./src/schema/**/*.ts'],
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL
  }
});
