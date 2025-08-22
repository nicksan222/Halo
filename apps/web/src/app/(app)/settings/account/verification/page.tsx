import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { VerificationClient } from './client';
import type { VerificationPageProps } from './types';

export default async function AccountVerificationPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const props: VerificationPageProps = {
    user: session.user
  };

  return <VerificationClient {...props} />;
}
