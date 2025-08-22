import { bool, cleanEnv, num, port, str, url } from 'envalid';

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

  // Storage (Provider selector)
  STORAGE_PROVIDER: str({ choices: ['vercel-blob', 's3'], default: 's3' }),

  // Storage (Vercel Blob)
  BLOB_READ_WRITE_TOKEN: str({
    desc: 'Vercel Blob read-write token. Required for server-side blob operations in non-Vercel envs.',
    default: ''
  }),

  // Storage (S3/MinIO)
  S3_REGION: str({ default: 'us-east-1' }),
  S3_BUCKET: str({ default: 'acme' }),
  S3_ACCESS_KEY_ID: str({ default: 'minioadmin' }),
  S3_SECRET_ACCESS_KEY: str({ default: 'minioadmin' }),
  S3_ENDPOINT: str({ default: 'http://127.0.0.1:9000' }),
  S3_FORCE_PATH_STYLE: bool({ default: true }),
  S3_PUBLIC_URL: str({ default: 'http://127.0.0.1:9000/acme' }),

  // Web app public config
  NEXT_PUBLIC_API_URL: url({ default: 'http://localhost:3001', desc: 'Public base URL for API' }),

  // Email (Provider selector)
  EMAIL_PROVIDER: str({ choices: ['resend', 'smtp', 'ses', 'mailpit'], default: 'resend' }),

  // Email (Resend)
  RESEND_API_KEY: str({ desc: 'Resend API key', default: '' }),
  RESEND_FROM_EMAIL: str({ desc: 'Default From email for Resend', default: '' }),

  // Email (SMTP)
  SMTP_HOST: str({ default: '' }),
  SMTP_PORT: num({ default: 587 }),
  SMTP_SECURE: bool({ default: false }),
  SMTP_USER: str({ default: '' }),
  SMTP_PASSWORD: str({ default: '' }),
  SMTP_FROM: str({ default: '' }),

  // Email (SES)
  AWS_REGION: str({ default: 'us-east-1' }),
  AWS_ACCESS_KEY_ID: str({ default: '' }),
  AWS_SECRET_ACCESS_KEY: str({ default: '' }),
  SES_FROM: str({ default: '' })
});

export type Env = typeof env;
