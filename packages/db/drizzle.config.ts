import { env } from '@acme/env';
import { defineConfig } from 'drizzle-kit';
import { neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon for local/CI when using a local proxy (db.localtest.me or localhost via port 4444)
try {
	const dbUrl = new URL(env.DATABASE_URL);
	const host = dbUrl.hostname;

	// Always set ws constructor in Node environments
	neonConfig.webSocketConstructor = ws;

	// Map db.localtest.me and localhost to the local Neon HTTP proxy (port 4444)
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
