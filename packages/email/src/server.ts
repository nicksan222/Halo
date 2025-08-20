import { env } from '@acme/env';
import { createResendStrategy } from './providers/resend';
import { createSesStrategy } from './providers/ses';
import { createSmtpStrategy } from './providers/smtp';
import { createMailpitStrategy } from './providers/mailpit';
import type { EmailClientConfig, EmailStrategy, SendEmailInput, SendEmailResult } from './types';

function configFromEnv(): EmailClientConfig {
  const provider = env.EMAIL_PROVIDER as EmailClientConfig['provider'];
  if (provider === 'resend') {
    return {
      provider: 'resend',
      apiKey: env.RESEND_API_KEY || undefined,
      from: env.RESEND_FROM_EMAIL || undefined
    };
  }
  if (provider === 'smtp') {
    return {
      provider: 'smtp',
      host: env.SMTP_HOST || 'localhost',
      port: Number(env.SMTP_PORT || 587),
      secure: Boolean(env.SMTP_SECURE),
      user: env.SMTP_USER || undefined,
      password: env.SMTP_PASSWORD || undefined,
      from: env.SMTP_FROM || undefined
    };
  }
  if (provider === 'mailpit') {
    return {
      provider: 'mailpit',
      host: env.SMTP_HOST || 'localhost',
      port: Number(env.SMTP_PORT || 1025),
      secure: Boolean(env.SMTP_SECURE),
      user: env.SMTP_USER || undefined,
      password: env.SMTP_PASSWORD || undefined,
      from: env.SMTP_FROM || undefined
    };
  }
  return {
    provider: 'ses',
    region: env.AWS_REGION || 'us-east-1',
    accessKeyId: env.AWS_ACCESS_KEY_ID || undefined,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY || undefined,
    from: env.SES_FROM || undefined
  };
}

function buildStrategy(config: EmailClientConfig): EmailStrategy {
  switch (config.provider) {
    case 'resend':
      return createResendStrategy(config);
    case 'smtp':
      return createSmtpStrategy(config);
    case 'mailpit':
      return createMailpitStrategy(config);
    case 'ses':
      return createSesStrategy(config);
  }
}

export function createEmailClient(explicitConfig?: EmailClientConfig) {
  const cfg = explicitConfig ?? configFromEnv();
  const strategy = buildStrategy(cfg);
  return {
    send(input: SendEmailInput): Promise<SendEmailResult> {
      return strategy.send(input);
    }
  };
}
