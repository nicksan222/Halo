import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { ProfileClient } from './client';
import type { ProfilePageProps } from './types';

export default async function AccountProfilePage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const props: ProfilePageProps = {
    user: session.user
  };

  return <ProfileClient {...props} />;
}
