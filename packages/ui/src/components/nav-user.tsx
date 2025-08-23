'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@acme/ui/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
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
import { BadgeCheck, Bell, ChevronsUpDown, CreditCard, LogOut, Sparkles } from 'lucide-react';

export function NavUser({
  user,
  onUpgrade,
  onAccount,
  onBilling,
  onNotifications,
  onLogout,
  features = {},
  isLoading = false,
  labels = {}
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
  onUpgrade?: () => void;
  onAccount?: () => void;
  onBilling?: () => void;
  onNotifications?: () => void;
  onLogout?: () => void;
  features?: {
    showUpgrade?: boolean;
    showAccount?: boolean;
    showBilling?: boolean;
    showNotifications?: boolean;
  };
  isLoading?: boolean;
  labels?: {
    upgradeToPro?: string;
    account?: string;
    billing?: string;
    notifications?: string;
    logOut?: string;
  };
}) {
  const { isMobile } = useSidebar();

  const {
    showUpgrade = true,
    showAccount = true,
    showBilling = true,
    showNotifications = true
  } = features;

  const {
    upgradeToPro = 'Upgrade to Pro',
    account = 'Account',
    billing = 'Billing',
    notifications = 'Notifications',
    logOut = 'Log out'
  } = labels;

  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" disabled>
            <div className="h-8 w-8 rounded-lg bg-sidebar-foreground/20 animate-pulse" />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <div className="h-4 w-20 rounded bg-sidebar-foreground/20 animate-pulse" />
              <div className="h-3 w-24 rounded bg-sidebar-foreground/20 animate-pulse mt-1" />
            </div>
            <ChevronsUpDown className="ml-auto size-4 opacity-50" />
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {user.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {showUpgrade && (
              <>
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={onUpgrade}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {upgradeToPro}
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
              </>
            )}
            {(showAccount || showBilling || showNotifications) && (
              <DropdownMenuGroup>
                {showAccount && (
                  <DropdownMenuItem onClick={onAccount}>
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    {account}
                  </DropdownMenuItem>
                )}
                {showBilling && (
                  <DropdownMenuItem onClick={onBilling}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    {billing}
                  </DropdownMenuItem>
                )}
                {showNotifications && (
                  <DropdownMenuItem onClick={onNotifications}>
                    <Bell className="mr-2 h-4 w-4" />
                    {notifications}
                  </DropdownMenuItem>
                )}
              </DropdownMenuGroup>
            )}
            {(showAccount || showBilling || showNotifications) && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={onLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {logOut}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
