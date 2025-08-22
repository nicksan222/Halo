import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { IntegrationsClient } from './client';
import type { IntegrationsPageProps } from './types';

export default async function OrganizationIntegrationsPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    redirect('/');
  }

  const props: IntegrationsPageProps = {
    organizationId
  };

  return <IntegrationsClient {...props} />;
}
