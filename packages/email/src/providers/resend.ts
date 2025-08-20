import { Resend } from 'resend';
import type { EmailStrategy, ResendConfig, SendEmailInput, SendEmailResult } from '../types';
import { SendEmailSchema } from '../types';

export function createResendStrategy(config: ResendConfig): EmailStrategy {
  const apiKey = config.apiKey ?? '';
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const client = new Resend(apiKey);
  const defaultFrom = config.from;

  return {
    async send(input: SendEmailInput): Promise<SendEmailResult> {
      const parsed = SendEmailSchema.safeParse(input);
      if (!parsed.success) throw new Error(parsed.error.message);
      const { recipientEmail, subject, html, text, from, replyTo } = parsed.data;

      const fromEmail = from ?? defaultFrom;
      if (!fromEmail) throw new Error('Missing from address');

      const { data, error } = await client.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject,
        html,
        text,
        replyTo
      });

      if (error) return { id: '', status: 'failed' };
      return { id: data?.id ?? '', status: data?.id ? 'sent' : 'queued' };
    }
  };
}
