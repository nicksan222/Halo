import type { auth } from '@acme/auth';

export interface ProfilePageProps {
  user: typeof auth.$Infer.Session.user;
}

export interface ProfileFormValues {
  name: string;
  image?: string;
}
