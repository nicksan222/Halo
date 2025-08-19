import { SidebarProvider, SidebarTrigger } from '@acme/ui/components/sidebar';
import type React from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/sidebar/app-sidebar';

export default function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex-1 flex min-h-svh flex-col">
        <header className="sticky top-0 z-10">
          <div className="border-b bg-background">
            <div className="h-14 flex items-center gap-2 px-4">
              <SidebarTrigger />
              <AppHeader />
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto w-full p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
