'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { useQuery } from '@tanstack/react-query';
import { usePathname, useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { useLocale } from '@/providers/i18n-provider';
import Shell from '@/shell';
import { lang } from './lang';

export default function OrganizationSettingsLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = translate(lang, locale);

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
  const organizationName = activeOrganization?.name ?? (isLoading ? t.loading : '');

  return (
    <Shell>
      <Shell.Header>
        <Shell.Back href="/" />
        <Shell.Title>{organizationName}</Shell.Title>
        <Shell.Description>{t.description}</Shell.Description>
      </Shell.Header>
      <Shell.TabContainer position="side">
        <Shell.Tab
          title={t.tabs.members}
          description={t.tabs.membersDescription}
          href={`/settings/organization/members`}
          isActive={pathname === '/settings/organization/members'}
        />
        <Shell.Tab
          title={t.tabs.settings}
          description={t.tabs.settingsDescription}
          href={`/settings/organization/settings`}
          isActive={pathname === '/settings/organization/settings'}
        />
        <Shell.Tab
          title={t.tabs.billing}
          description={t.tabs.billingDescription}
          href={`/settings/organization/billing`}
          isActive={pathname === '/settings/organization/billing'}
        />
        <Shell.Tab
          title={t.tabs.integrations}
          description={t.tabs.integrationsDescription}
          href={`/settings/organization/integrations`}
          isActive={pathname === '/settings/organization/integrations'}
        />
        {isAdminOrOwner && (
          <Shell.Tab
            title={t.tabs.pendingInvitations}
            description={t.tabs.pendingInvitationsDescription}
            href={`/settings/organization/pending-invitations`}
            isActive={pathname === '/settings/organization/pending-invitations'}
          />
        )}
        {isOwner && (
          <Shell.Tab
            title={t.tabs.delete}
            description={t.tabs.deleteDescription}
            href={`/settings/organization/delete`}
            isActive={pathname === '/settings/organization/delete'}
          />
        )}
      </Shell.TabContainer>
      <Shell.Content>{children}</Shell.Content>
    </Shell>
  );
}
