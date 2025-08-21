import { translate } from '@acme/localization';
import { useLocale } from '@acme/localization/next-server';
import { SidebarProvider, SidebarTrigger } from '@acme/ui/components/sidebar';
import { cookies, headers } from 'next/headers';
import type React from 'react';
import { AppHeader } from '@/components/layout/app-header';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { lang } from './lang';

export default async function AppLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const cookiesList = await cookies();

  const { locale } = useLocale(
    {
      headers: headersList,
      cookies: {
        get: (name) => cookiesList.get(name)?.value,
        set: (name, value) => cookiesList.set(name, value)
      }
    },
    { cookieName: 'locale', defaultLocale: 'en' }
  );
  const t = translate(lang, locale);

  return (
    <SidebarProvider>
      <AppSidebar
        labels={{
          application: t.sidebar.application,
          todos: t.sidebar.todos,
          newTodo: t.sidebar.newTodo,
          teamNamePrompt: t.sidebar.teamNamePrompt,
          freePlan: t.sidebar.freePlan
        }}
      />
      <div className="flex-1 flex min-h-svh flex-col">
        <header className="sticky top-0 z-10">
          <div className="border-b bg-background">
            <div className="h-14 flex items-center gap-2 px-4">
              <SidebarTrigger />
              <AppHeader
                appName={t.header.appName}
                newLabel={t.header.new}
                signOutLabel={t.header.signOut}
              />
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto w-full p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
