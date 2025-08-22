import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SecurityClient } from './client';
import type { SecurityPageProps } from './types';

export default async function AccountSecurityPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const props: SecurityPageProps = {
    user: session.user
  };

  return <SecurityClient {...props} />;
}
