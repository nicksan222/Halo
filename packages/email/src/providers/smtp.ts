import type { EmailStrategy, SendEmailInput, SendEmailResult, SmtpConfig } from '../types';
import { SendEmailSchema } from '../types';

export function createSmtpStrategy(config: SmtpConfig): EmailStrategy {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const nodemailer = require('nodemailer');
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: Boolean(config.secure),
    auth: config.user && config.password ? { user: config.user, pass: config.password } : undefined
  });
  const defaultFrom = config.from;

  return {
    async send(input: SendEmailInput): Promise<SendEmailResult> {
      const parsed = SendEmailSchema.safeParse(input);
      if (!parsed.success) throw new Error(parsed.error.message);
      const { recipientEmail, subject, html, text, from, replyTo } = parsed.data;

      const fromEmail = from ?? defaultFrom;
      if (!fromEmail) throw new Error('Missing from address');

      const info = await transport.sendMail({
        from: fromEmail,
        to: recipientEmail,
        subject,
        html,
        text,
        replyTo
      });
      return { id: info?.messageId ?? '', status: 'sent' };
    }
  };
}
