import { cleanEnv, port, str, url } from 'envalid';

// Define and validate environment variables used across the monorepo
export const env = cleanEnv(process.env, {
  // Runtime
  NODE_ENV: str({
    choices: ['development', 'test', 'production', 'staging'],
    default: 'development'
  }),

  // Database
  DATABASE_URL: str({
    desc: 'PostgreSQL connection string',
    default: 'postgres://postgres:postgres@db.localtest.me:5432/acme'
  }),

  // API server
  PORT: port({ default: 3001, desc: 'API server port' }),
  CORS_ORIGIN: url({ default: 'http://localhost:3000', desc: 'Allowed CORS origin for API' }),

  // Storage (Vercel Blob)
  BLOB_READ_WRITE_TOKEN: str({
    desc: 'Vercel Blob read-write token. Required for server-side blob operations in non-Vercel envs.',
    default: ''
  }),

  // Web app public config
  NEXT_PUBLIC_API_URL: url({ default: 'http://localhost:3001', desc: 'Public base URL for API' })
});

export type Env = typeof env;
