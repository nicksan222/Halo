'use client';

import { authClient } from '@acme/auth/client';
import { NavUser } from '@acme/ui/components/nav-user';
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
import { TeamSwitcher } from '@acme/ui/components/team-switcher';
import { ListTodo, Plus } from 'lucide-react';

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
  const { data: session } = authClient.useSession();
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();

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
    logo: org.logo ?? '',
    plan: org.metadata?.plan ?? labels?.freePlan ?? 'Free',
    id: org.id,
    slug: org.slug
  }));

  const activeTeam = activeOrganization
    ? {
        name: activeOrganization.name,
        logo: activeOrganization.logo ?? '',
        plan: activeOrganization.metadata?.plan ?? labels?.freePlan ?? 'Free',
        id: activeOrganization.id,
        slug: activeOrganization.slug
      }
    : teams[0];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        {activeTeam && (
          <TeamSwitcher
            teams={teams}
            activeTeam={activeTeam}
            onTeamChange={async (team) => {
              // set active organization in session
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
          />
        )}
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
        {user && (
          <NavUser
            user={user}
            onUpgrade={() => {
              if (activeTeam) {
                // navigate to a generic upgrade page; adjust to your routes
                window.location.assign(`/settings/billing`);
              }
            }}
            onAccount={() => window.location.assign('/settings/account')}
            onBilling={() => window.location.assign('/settings/billing')}
            onNotifications={() => window.location.assign('/settings/notifications')}
            onLogout={async () => {
              await authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    window.location.assign('/auth/sign-in');
                  }
                }
              });
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
