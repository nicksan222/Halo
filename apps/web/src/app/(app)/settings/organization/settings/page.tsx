import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { SettingsClient } from './client';
import type { SettingsPageProps } from './types';

export default async function OrganizationSettingsEditPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    redirect('/');
  }

  // Fetch organization data server-side
  const organization = await auth.api.getFullOrganization({
    query: { organizationId },
    headers: headersList
  });

  if (!organization) {
    redirect('/');
  }

  const props: SettingsPageProps = {
    organizationId,
    organization
  };

  return <SettingsClient {...props} />;
}
