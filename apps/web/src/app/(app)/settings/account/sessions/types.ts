import type { auth } from '@acme/auth';

export interface SessionsPageProps {
  user: typeof auth.$Infer.Session.user;
  sessions: Session[];
}

export interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}
