import { auth } from '@acme/auth';
import { db } from '@acme/db';
import { sessions } from '@acme/db/src/schema/auth';
import { translate } from '@acme/localization';
import { useLocale } from '@acme/localization/next-server';
import { eq } from 'drizzle-orm';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SessionsClient } from './client';
import { lang } from './lang';
import type { SessionsPageProps } from './types';

export default async function AccountSessionsPage() {
  const headersList = await headers();
  const cookiesList = await cookies();

  const { locale } = useLocale(
    {
      headers: headersList,
      cookies: {
        get: (name) => cookiesList.get(name)?.value,
        set: (name, value) => cookiesList.set(name, value)
      }
    },
    { cookieName: 'locale', defaultLocale: 'en' }
  );
  const t = translate(lang, locale);

  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  // Fetch sessions from database
  const userSessions = await db.select().from(sessions).where(eq(sessions.userId, session.user.id));

  // Transform sessions to match our interface
  const transformedSessions = userSessions.map((s) => ({
    id: s.token,
    device: s.userAgent || t.unknownDevice,
    location: s.ipAddress || t.unknownLocation,
    lastActive: s.expiresAt.toISOString(),
    isCurrent: s.token === session.session.token
  }));

  const props: SessionsPageProps = {
    user: session.user,
    sessions: transformedSessions
  };

  return <SessionsClient {...props} />;
}
