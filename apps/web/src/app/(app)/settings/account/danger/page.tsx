import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { DangerClient } from './client';
import type { DangerPageProps } from './types';

export default async function AccountDangerPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const props: DangerPageProps = {
    user: session.user
  };

  return <DangerClient {...props} />;
}
