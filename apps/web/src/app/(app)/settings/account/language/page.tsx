import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { LanguageClient } from './client';

export default async function AccountLanguagePage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  return <LanguageClient />;
}
