import { auth } from '@acme/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { MembersClient } from './client';
import type { MembersPageProps } from './types';

export default async function OrganizationMembersPage() {
  const headersList = await headers();
  const session = await auth.api.getSession({ headers: headersList });

  if (!session) {
    redirect('/auth/sign-in');
  }

  const organizationId = session.session.activeOrganizationId;
  if (!organizationId) {
    redirect('/');
  }

  try {
    const membersResponse = await auth.api.listMembers({
      query: { organizationId, limit: 100, offset: 0 },
      headers: headersList
    });

    if (!membersResponse.members) {
      throw new Error('Failed to fetch members');
    }

    const members = membersResponse.members as (typeof auth.$Infer.Member)[];
    const currentUserMembership = members.find((m) => m.userId === session.session.userId);

    if (!currentUserMembership) {
      console.error('Current user not found in members list:', {
        sessionUserId: session.session.userId,
        memberUserIds: members.map((m) => ({ id: m.id, userId: m.userId, name: m.user.name }))
      });
      throw new Error('Current user not found in organization members');
    }

    console.log('Current user found:', {
      userId: currentUserMembership.userId,
      name: currentUserMembership.user.name,
      role: currentUserMembership.role
    });

    const props: MembersPageProps = {
      members,
      session,
      currentUserMembership,
      organizationId
    };

    return <MembersClient {...props} />;
  } catch (error) {
    console.error('Error fetching members:', error);
    // In a real app, you might want to show an error page or redirect
    throw new Error('Failed to load organization members');
  }
}
