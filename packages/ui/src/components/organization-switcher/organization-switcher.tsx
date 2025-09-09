'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@acme/ui/components/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from '@acme/ui/components/sidebar';
import { ChevronsUpDown, Plus } from 'lucide-react';
import { useState } from 'react';
import type { OrganizationSwitcherProps } from './types';

export function OrganizationSwitcher({
  organizations,
  activeOrganization,
  onOrganizationChange,
  onAddOrganization,
  onSettings,
  isLoading = false,
  labels = {
    organizations: 'Organizations',
    addOrganization: 'Add organization',
    settings: 'Settings'
  }
}: OrganizationSwitcherProps) {
  const { isMobile } = useSidebar();
  const [isOpen, setIsOpen] = useState(false);

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

  if (!activeOrganization) {
    return null;
  }

  const renderLogo = (className: string) => {
    // Building icon for organizations
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
        />
      </svg>
    );
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                {renderLogo('size-4')}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{activeOrganization.name}</span>
                <span className="truncate text-xs">{activeOrganization.plan}</span>
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
            <DropdownMenuLabel className="text-muted-foreground text-xs">
              {labels.organizations}
            </DropdownMenuLabel>
            {organizations.map((organization, _index) => (
              <DropdownMenuItem
                key={organization.id}
                onClick={async () => {
                  await onOrganizationChange(organization);
                  setIsOpen(false);
                  // Navigate to home page and perform a full page reload after session update
                  window.location.href = '/';
                }}
                className="gap-2 p-2"
              >
                <div className="flex size-6 items-center justify-center rounded-md border">
                  {renderLogo('size-3.5 shrink-0')}
                </div>
                {organization.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2" onClick={onAddOrganization}>
              <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">{labels.addOrganization}</div>
            </DropdownMenuItem>
            {onSettings && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="gap-2 p-2 bg-accent text-accent-foreground"
                  onClick={() => {
                    const activeOrganizationWithId = organizations.find(
                      (org) => org.name === activeOrganization.name
                    );
                    if (activeOrganizationWithId) {
                      onSettings(activeOrganizationWithId);
                    }
                    setIsOpen(false);
                  }}
                >
                  <div className="flex size-6 items-center justify-center rounded-md border">
                    {renderLogo('size-3.5 shrink-0')}
                  </div>
                  <div className="font-medium">{labels.settings}</div>
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
