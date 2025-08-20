/**
 * Email client (strategy-based)
 *
 * Configuration order of precedence:
 * 1) Explicit config passed to createEmailClient(config)
 * 2) Environment variables from @acme/env
 *
 * Supported providers: 'resend' | 'smtp' | 'ses'
 *
 * Env configuration (typed in @acme/env):
 * - EMAIL_PROVIDER: 'resend' | 'smtp' | 'ses' (default: 'resend')
 *
 * Resend:
 * - RESEND_API_KEY
 * - RESEND_FROM_EMAIL
 *
 * SMTP:
 * - SMTP_HOST, SMTP_PORT, SMTP_SECURE
 * - SMTP_USER, SMTP_PASSWORD
 * - SMTP_FROM
 *
 * SES:
 * - AWS_REGION
 * - AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY
 * - SES_FROM
 *
 * Usage:
 * const email = createEmailClient(); // uses env
 * await email.send({ recipientEmail, subject, html, text, from, replyTo });
 *
 * Or with explicit config:
 * const email = createEmailClient({ provider: 'smtp', host, port, user, password, from });
 */
export { createEmailClient } from './server';
export type {
  EmailClientConfig,
  EmailProvider,
  SendEmailInput,
  SendEmailResult
} from './types';
