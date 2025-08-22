'use client';

import { authClient } from '@acme/auth/client';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import Shell from '@/shell';

export default function OrganizationSettingsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const { data: activeOrganization, isPending: isOrgPending } = authClient.useActiveOrganization();
  // fetch active member to derive role properly (no ts-expect-errors)
  const { data: activeMember } = useQuery({
    queryKey: ['organization', activeOrganization?.id, 'active-member'],
    enabled: !!session && !!activeOrganization,
    queryFn: async () => {
      const res = await authClient.organization.getActiveMember();
      if (res.error) throw new Error(res.error.message || 'Failed to fetch active member');
      return res.data as { role?: 'owner' | 'admin' | 'member' } | undefined;
    }
  });
  const role = activeMember?.role;
  const isAdminOrOwner = role === 'admin' || role === 'owner';
  const isOwner = role === 'owner';

  useEffect(() => {
    if (!isSessionPending && !session) {
      router.replace('/auth/sign-in');
    }
  }, [isSessionPending, session, router]);

  useEffect(() => {
    if (!isOrgPending && session && !activeOrganization) {
      router.replace('/');
    }
  }, [isOrgPending, session, activeOrganization, router]);

  const isLoading = isSessionPending || isOrgPending;
  const organizationName = activeOrganization?.name ?? (isLoading ? 'Loading…' : '');

  return (
    <Shell>
      <Shell.Header>
        <Shell.Back href="/" />
        <Shell.Title>{organizationName}</Shell.Title>
        <Shell.Description>Manage your organization settings</Shell.Description>
      </Shell.Header>
      <Shell.TabContainer position="side">
        <Shell.Tab
          title="Members"
          description="Manage organization members"
          href={`/settings/organization/members`}
          isActive={pathname === '/settings/organization/members'}
        />
        <Shell.Tab
          title="Settings"
          description="Organization settings"
          href={`/settings/organization/settings`}
          isActive={pathname === '/settings/organization/settings'}
        />
        <Shell.Tab
          title="Billing"
          description="Billing and subscription"
          href={`/settings/organization/billing`}
          isActive={pathname === '/settings/organization/billing'}
        />
        <Shell.Tab
          title="Integrations"
          description="Third-party integrations"
          href={`/settings/organization/integrations`}
          isActive={pathname === '/settings/organization/integrations'}
        />
        {isAdminOrOwner && (
          <Shell.Tab
            title="Pending invitations"
            description="View and manage invitations"
            href={`/settings/organization/pending-invitations`}
            isActive={pathname === '/settings/organization/pending-invitations'}
          />
        )}
        {isOwner && (
          <Shell.Tab
            title="Delete"
            description="Delete organization"
            href={`/settings/organization/delete`}
            isActive={pathname === '/settings/organization/delete'}
          />
        )}
      </Shell.TabContainer>
      <Shell.Content>{children}</Shell.Content>
    </Shell>
  );
}
