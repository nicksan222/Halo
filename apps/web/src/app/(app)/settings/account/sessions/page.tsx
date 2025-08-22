import { auth } from '@acme/auth';
import { db } from '@acme/db';
import { sessions } from '@acme/db/src/schema/auth';
import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SessionsClient } from './client';
import type { SessionsPageProps } from './types';

export default async function AccountSessionsPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  // Fetch sessions from database
  const userSessions = await db.select().from(sessions).where(eq(sessions.userId, session.user.id));

  // Transform sessions to match our interface
  const transformedSessions = userSessions.map((s) => ({
    id: s.token,
    device: s.userAgent || 'Unknown device',
    location: s.ipAddress || 'Unknown location',
    lastActive: s.expiresAt.toISOString(),
    isCurrent: s.token === session.session.token
  }));

  const props: SessionsPageProps = {
    user: session.user,
    sessions: transformedSessions
  };

  return <SessionsClient {...props} />;
}
