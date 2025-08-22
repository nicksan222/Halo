'use client';

import { authClient } from '@acme/auth/client';
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
import { NotificationsPopover } from './notifications-popover';

interface AppSidebarLabels {
  application?: string;
  todos?: string;
  newTodo?: string;
  teamNamePrompt?: string;
  freePlan?: string;
}

interface AppSidebarProps {
  labels?: AppSidebarLabels;
}

export function AppSidebar({ labels }: AppSidebarProps) {
  const router = useRouter();
  const { data: session, isPending: isLoadingSession } = authClient.useSession();
  const { data: organizations, isPending: isLoadingOrganizations } =
    authClient.useListOrganizations();
  const { data: activeOrganization, isPending: isLoadingActiveOrganization } =
    authClient.useActiveOrganization();

  const user = session?.user
    ? {
        name: session.user.name ?? 'User',
        email: session.user.email ?? '',
        avatar: session.user.image ?? ''
      }
    : undefined;

  const items = [
    { title: labels?.todos ?? 'Todos', url: '/', icon: ListTodo },
    { title: labels?.newTodo ?? 'New Todo', url: '/todos/new', icon: Plus }
  ];

  const teams = (organizations ?? []).map((org) => ({
    name: org.name,
    plan: org.metadata?.plan ?? labels?.freePlan ?? 'Free',
    id: org.id,
    slug: org.slug
  }));

  const activeTeam = activeOrganization
    ? {
        name: activeOrganization.name,
        plan: activeOrganization.metadata?.plan ?? labels?.freePlan ?? 'Free',
        id: activeOrganization.id,
        slug: activeOrganization.slug
      }
    : teams[0];

  const isLoading = isLoadingOrganizations || isLoadingActiveOrganization;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <OrganizationSwitcher
          teams={teams}
          activeTeam={activeTeam}
          onTeamChange={async (team) => {
            await authClient.organization.setActive({ organizationId: team.id });
          }}
          onAddTeam={async () => {
            const name =
              typeof window !== 'undefined'
                ? window.prompt(labels?.teamNamePrompt ?? 'Team name')
                : undefined;
            if (!name) return;
            const slug = name
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/(^-|-$)/g, '');
            await authClient.organization.create({ name, slug });
          }}
          onSettings={() => {
            router.push(`/settings/organization/members`);
          }}
          isLoading={isLoading}
        />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{labels?.application ?? 'Application'}</SidebarGroupLabel>
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
            trigger={(unreadCount) => (
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton className="w-full justify-start">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
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
        />
      </SidebarFooter>
    </Sidebar>
  );
}
