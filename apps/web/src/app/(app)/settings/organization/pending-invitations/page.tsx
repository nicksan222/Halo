import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { PendingInvitationsClient } from './client';
import type { PendingInvitationsPageProps } from './types';

export default async function PendingInvitationsPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    redirect('/');
  }

  // Fetch members to compute current user's role
  const membersResponse = await auth.api.listMembers({
    query: { organizationId, limit: 100, offset: 0 },
    headers: headersList
  });
  const members = (membersResponse.members ?? []) as (typeof auth.$Infer.Member)[];
  const currentUserMembership = members.find((m) => m.userId === session.session.userId);
  const role = currentUserMembership?.role;
  if (role !== 'admin' && role !== 'owner') {
    redirect('/settings/organization/members');
  }

  // Fetch invitations server-side
  const invitations = (await auth.api.listInvitations({
    query: { organizationId },
    headers: headersList
  })) as (typeof auth.$Infer.Invitation)[];

  const props: PendingInvitationsPageProps = {
    organizationId,
    invitations
  };

  return <PendingInvitationsClient {...props} />;
}
