import type { auth } from '@acme/auth';

export interface PendingInvitationsPageProps {
  organizationId: string;
  invitations: (typeof auth.$Infer.Invitation)[];
}
