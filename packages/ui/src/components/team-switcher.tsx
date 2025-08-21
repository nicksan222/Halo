'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@acme/ui/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@acme/ui/components/sidebar';
import { ChevronsUpDown, Plus } from 'lucide-react';
import type * as React from 'react';

export function TeamSwitcher({
  teams,
  activeTeam,
  onTeamChange,
  onAddTeam,
  isLoading = false
}: {
  teams: {
    name: string;
    logo: React.ElementType | string;
    plan: string;
    id: string;
  }[];
  activeTeam: {
    name: string;
    logo: React.ElementType | string;
    plan: string;
  };
  onTeamChange: (team: {
    name: string;
    logo: React.ElementType | string;
    plan: string;
    id: string;
  }) => void;
  onAddTeam: () => void;
  isLoading?: boolean;
}) {
  const { isMobile } = useSidebar();

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg animate-pulse">
              <div className="size-4 rounded bg-sidebar-primary-foreground/20" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="h-4 w-24 rounded bg-sidebar-foreground/20 animate-pulse" />
              <div className="h-3 w-16 rounded bg-sidebar-foreground/20 animate-pulse mt-1" />
            </div>
            <ChevronsUpDown className="ml-auto opacity-50" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!activeTeam) {
    return null;
  }

  const renderLogo = (logo: React.ElementType | string, className: string) => {
    if (typeof logo === 'string') {
      return <img src={logo} alt="" className={className} />;
    }
    const LogoComponent = logo;
    return <LogoComponent className={className} />;
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {renderLogo(activeTeam.logo, 'size-4')}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeTeam.name}</span>
                <span className="truncate text-xs">{activeTeam.plan}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Teams</DropdownMenuLabel>
            {teams.map((team, index) => (
              <DropdownMenuItem
                key={team.name}
                onClick={() => onTeamChange(team)}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {renderLogo(team.logo, 'size-3.5 shrink-0')}
                </div>
                {team.name}
                <DropdownMenuShortcut>⌘{index + 1}</DropdownMenuShortcut>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={onAddTeam}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Add team</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
