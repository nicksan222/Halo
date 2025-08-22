import type { auth } from '@acme/auth';

export interface SecurityPageProps {
  user: typeof auth.$Infer.Session.user;
}

export interface EmailFormValues {
  email: string;
}

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
