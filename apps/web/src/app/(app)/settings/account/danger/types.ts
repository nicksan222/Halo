import type { auth } from '@acme/auth';

export interface DangerPageProps {
  user: typeof auth.$Infer.Session.user;
}

export interface DangerFormValues {
  confirm: string;
}
