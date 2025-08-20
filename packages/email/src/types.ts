import { z } from 'zod';

export type EmailProvider = 'resend' | 'smtp' | 'ses' | 'mailpit';

export const SendEmailSchema = z.object({
  recipientEmail: z.string().email(),
  subject: z.string().min(1),
  html: z.string().min(1),
  text: z.string().optional(),
  from: z.string().email().optional(),
  replyTo: z.string().email().optional()
});

export type SendEmailInput = z.infer<typeof SendEmailSchema>;

export type SendEmailResult = {
  id: string;
  status: 'queued' | 'sent' | 'rejected' | 'failed';
};

export type BaseEmailConfig = {
  from?: string;
};

export type ResendConfig = BaseEmailConfig & {
  provider: 'resend';
  apiKey?: string;
};

export type SmtpConfig = BaseEmailConfig & {
  provider: 'smtp';
  host: string;
  port: number;
  secure?: boolean;
  user?: string;
  password?: string;
};

export type SesConfig = BaseEmailConfig & {
  provider: 'ses';
  region: string;
  accessKeyId?: string;
  secretAccessKey?: string;
};

export type MailpitConfig = BaseEmailConfig & {
  provider: 'mailpit';
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  password?: string;
};

export type EmailClientConfig = ResendConfig | SmtpConfig | SesConfig | MailpitConfig;

export interface EmailStrategy {
  send(input: SendEmailInput): Promise<SendEmailResult>;
}
