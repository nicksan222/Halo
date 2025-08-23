'use client';

import { authClient } from '@acme/auth/client';
import { translate } from '@acme/localization';
import { Button } from '@acme/ui/components/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@acme/ui/components/dialog';
import { Input } from '@acme/ui/components/input';
import { NavUser } from '@acme/ui/components/nav-user';
import { OrganizationSwitcher } from '@acme/ui/components/organization-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from '@acme/ui/components/sidebar';
import { Bell, ListTodo, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useLocale } from '@/localization/next';
import { CreateOrganization } from './create-organization';
import { sidebarLang } from './lang';
import { NotificationsPopover } from './notifications-popover';

export function AppSidebar() {
  const router = useRouter();
  const { data: session, isPending: isLoadingSession } = authClient.useSession();
  const { data: organizations, isPending: isLoadingOrganizations } =
    authClient.useListOrganizations();
  const { data: activeOrganization, isPending: isLoadingActiveOrganization } =
    authClient.useActiveOrganization();

  const locale = useLocale();
  const t = translate(sidebarLang, locale);

  const user = session?.user
    ? {
        name: session.user.name ?? 'User',
        email: session.user.email ?? '',
        avatar: session.user.image ?? ''
      }
    : undefined;

  const items = [
    { title: t.sidebar.todos, url: '/', icon: ListTodo },
    { title: t.sidebar.newTodo, url: '/todos/new', icon: Plus }
  ];

  const teams = (organizations ?? []).map((org) => ({
    name: org.name,
    plan: org.metadata?.plan ?? t.sidebar.freePlan,
    id: org.id,
    slug: org.slug
  }));

  const activeTeam = activeOrganization
    ? {
        name: activeOrganization.name,
        plan: activeOrganization.metadata?.plan ?? t.sidebar.freePlan,
        id: activeOrganization.id,
        slug: activeOrganization.slug
      }
    : teams[0];

  const isLoading = isLoadingOrganizations || isLoadingActiveOrganization;

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [orgName, setOrgName] = useState('');

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <CreateOrganization>
          {({ create, isCreating }) => (
            <>
              <OrganizationSwitcher
                teams={teams}
                activeTeam={activeTeam}
                onTeamChange={async (team) => {
                  await authClient.organization.setActive({ organizationId: team.id });
                }}
                onAddTeam={() => setIsCreateOpen(true)}
                onSettings={() => {
                  router.push(`/settings/organization/members`);
                }}
                isLoading={isLoading}
              />
              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.sidebar.teamNamePrompt}</DialogTitle>
                  </DialogHeader>
                  <div className="py-2">
                    <Input
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      placeholder={t.sidebar.teamNamePrompt}
                      autoFocus
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsCreateOpen(false);
                        setOrgName('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={async () => {
                        await create(orgName);
                        setIsCreateOpen(false);
                        setOrgName('');
                      }}
                      disabled={isCreating || orgName.trim().length === 0}
                    >
                      {isCreating ? 'Creating…' : 'Create'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </>
          )}
        </CreateOrganization>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{t.sidebar.application}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 pb-2 w-full">
          <NotificationsPopover
            labels={{
              markAllRead: t.notifications.markAllRead,
              noNotifications: t.notifications.noNotifications,
              noNotificationsDescription: t.notifications.noNotificationsDescription,
              notificationSettings: t.notifications.notificationSettings,
              markReadSuccess: t.notifications.markReadSuccess,
              markReadError: t.notifications.markReadError,
              justNow: t.notifications.justNow,
              minutesAgo: t.notifications.minutesAgo,
              hoursAgo: t.notifications.hoursAgo,
              daysAgo: t.notifications.daysAgo
            }}
            trigger={(unreadCount) => (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>{t.notifications.notifications}</span>
                    {unreadCount > 0 && (
                      <span className="ml-auto inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] text-primary-foreground font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            )}
          />
        </div>
        <NavUser
          user={user ?? { name: '', email: '', avatar: '' }}
          onUpgrade={() => {
            if (activeTeam) {
              // navigate to a generic upgrade page; adjust to your routes
              router.push(`/settings/billing`);
            }
          }}
          onAccount={() => router.push('/settings/account')}
          onBilling={() => router.push('/settings/billing')}
          onNotifications={() => router.push('/settings/notifications')}
          onLogout={async () => {
            await authClient.signOut({
              fetchOptions: {
                onSuccess: () => {
                  router.push('/auth/sign-in');
                }
              }
            });
          }}
          features={{ showNotifications: false }}
          isLoading={isLoadingSession}
          labels={{
            upgradeToPro: t.sidebar.upgradeToPro,
            account: t.sidebar.account,
            billing: t.sidebar.billing,
            notifications: t.sidebar.navNotifications,
            logOut: t.sidebar.logOut
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
