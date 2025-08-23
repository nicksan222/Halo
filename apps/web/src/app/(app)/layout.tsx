import { SidebarProvider } from '@acme/ui/components/sidebar';
import type React from 'react';
import { AppSidebar } from '@/components/sidebar/app-sidebar';

export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex min-h-svh flex-col">{children}</div>
    </SidebarProvider>
  );
}
