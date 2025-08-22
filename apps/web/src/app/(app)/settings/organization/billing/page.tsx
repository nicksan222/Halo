import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { BillingClient } from './client';
import type { BillingPageProps } from './types';

export default async function OrganizationBillingPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    redirect('/');
  }

  const props: BillingPageProps = {
    organizationId
  };

  return <BillingClient {...props} />;
}
