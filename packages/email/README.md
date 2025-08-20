# @acme/email

Strategy-based email package supporting multiple providers (Resend, SMTP, SES) with a unified API.

## Features

- **Provider-agnostic API**: Same interface regardless of underlying email service
- **Multiple providers**: Resend, SMTP, SES support
- **Environment-based configuration**: Zero code changes to switch providers
- **Type-safe configuration**: All env vars validated via `@acme/env`
- **Lazy dependencies**: Only installs provider-specific packages when needed

## Configuration

### Environment Variables

All configuration is handled via environment variables in `@acme/env`:

#### Provider Selection
- `EMAIL_PROVIDER`: `'resend' | 'smtp' | 'ses'` (default: `'resend'`)

#### Resend Provider
- `RESEND_API_KEY`: Your Resend API key
- `RESEND_FROM_EMAIL`: Default sender address (e.g., "Acme <no-reply@acme.com>")

#### SMTP Provider
- `SMTP_HOST`: SMTP server hostname
- `SMTP_PORT`: SMTP server port (default: `587`)
- `SMTP_SECURE`: Use TLS/SSL (default: `false`)
- `SMTP_USER`: SMTP username (if authentication required)
- `SMTP_PASSWORD`: SMTP password (if authentication required)
- `SMTP_FROM`: Default sender address

#### SES Provider
- `AWS_REGION`: AWS region (default: `'us-east-1'`)
- `AWS_ACCESS_KEY_ID`: AWS access key (or use default credentials)
- `AWS_SECRET_ACCESS_KEY`: AWS secret key (or use default credentials)
- `SES_FROM`: Default sender address

### Explicit Configuration

You can also pass explicit configuration instead of using environment variables:

```typescript
import { createEmailClient } from '@acme/email';

// Resend
const resendClient = createEmailClient({
  provider: 'resend',
  apiKey: 'your-api-key',
  from: 'noreply@example.com'
});

// SMTP
const smtpClient = createEmailClient({
  provider: 'smtp',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  user: 'your-email@gmail.com',
  password: 'your-password',
  from: 'noreply@example.com'
});

// SES
const sesClient = createEmailClient({
  provider: 'ses',
  region: 'us-east-1',
  accessKeyId: 'your-access-key',
  secretAccessKey: 'your-secret-key',
  from: 'noreply@example.com'
});
```

## Usage

### Basic Usage (Environment-based)

```typescript
import { createEmailClient } from '@acme/email';

const email = createEmailClient(); // Uses EMAIL_PROVIDER and related env vars

await email.send({
  recipientEmail: 'user@example.com',
  subject: 'Welcome to Acme!',
  html: '<h1>Welcome!</h1><p>Thanks for joining us.</p>',
  text: 'Welcome! Thanks for joining us.' // Optional plain text version
});
```

### Advanced Usage

```typescript
import { createEmailClient } from '@acme/email';

const email = createEmailClient();

// Send with custom from address
await email.send({
  recipientEmail: 'user@example.com',
  subject: 'Password Reset',
  html: '<p>Click here to reset your password</p>',
  from: 'security@acme.com', // Overrides default
  replyTo: 'support@acme.com' // Optional reply-to address
});
```

## Provider Comparison

| Feature | Resend | SMTP | SES |
|---------|--------|------|-----|
| Setup complexity | Easy | Medium | Medium |
| Delivery rates | High | Variable | High |
| Cost | Pay-per-email | Server costs | Pay-per-email |
| Features | Templates, analytics | Basic | Advanced features |
| Best for | Startups, simple needs | Self-hosted, custom | Enterprise, AWS users |

## Dependencies

The package uses optional dependencies to keep bundle size minimal:

- `resend`: Required for Resend provider
- `nodemailer`: Required for SMTP provider (optional dependency)
- `@aws-sdk/client-ses`: Required for SES provider (optional dependency)

Only the dependencies for your chosen provider will be installed. 