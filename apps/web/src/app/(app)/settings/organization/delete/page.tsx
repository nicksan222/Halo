import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { DeleteClient } from './client';
import type { DeletePageProps } from './types';

export default async function OrganizationDeletePage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    redirect('/');
  }

  const props: DeletePageProps = {
    organizationId
  };

  return <DeleteClient {...props} />;
}
