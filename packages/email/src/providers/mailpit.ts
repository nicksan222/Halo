import type { EmailStrategy, MailpitConfig } from '../types';
import { createSmtpStrategy } from './smtp';

export function createMailpitStrategy(config: MailpitConfig): EmailStrategy {
  return createSmtpStrategy({
    provider: 'smtp',
    host: config.host ?? 'localhost',
    port: config.port ?? 1025,
    secure: Boolean(config.secure),
    user: config.user,
    password: config.password,
    from: config.from
  });
} 