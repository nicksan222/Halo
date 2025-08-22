import type { auth } from '@acme/auth';

export interface VerificationPageProps {
  user: typeof auth.$Infer.Session.user;
}
