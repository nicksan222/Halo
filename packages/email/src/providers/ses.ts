import type { EmailStrategy, SendEmailInput, SendEmailResult, SesConfig } from '../types';
import { SendEmailSchema } from '../types';

export function createSesStrategy(config: SesConfig): EmailStrategy {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { SESClient, SendEmailCommand } = require('@aws-sdk/client-ses');
  const client = new SESClient({
    region: config.region,
    credentials:
      config.accessKeyId && config.secretAccessKey
        ? { accessKeyId: config.accessKeyId, secretAccessKey: config.secretAccessKey }
        : undefined
  });
  const defaultFrom = config.from;

  return {
    async send(input: SendEmailInput): Promise<SendEmailResult> {
      const parsed = SendEmailSchema.safeParse(input);
      if (!parsed.success) throw new Error(parsed.error.message);
      const { recipientEmail, subject, html, text, from, replyTo } = parsed.data;

      const fromEmail = from ?? defaultFrom;
      if (!fromEmail) throw new Error('Missing from address');

      const command = new SendEmailCommand({
        Source: fromEmail,
        Destination: { ToAddresses: [recipientEmail] },
        ReplyToAddresses: replyTo ? [replyTo] : undefined,
        Message: {
          Subject: { Data: subject },
          Body: {
            Html: { Data: html },
            Text: text ? { Data: text } : undefined
          }
        }
      });
      const res = await client.send(command);
      return { id: res?.MessageId ?? '', status: 'sent' };
    }
  };
}
