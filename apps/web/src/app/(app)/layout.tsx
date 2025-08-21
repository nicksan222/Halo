import { translate } from '@acme/localization';
import { useLocale } from '@acme/localization/next-server';
import { SidebarProvider } from '@acme/ui/components/sidebar';
import { cookies, headers } from 'next/headers';
import type React from 'react';
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
      <div className="flex-1 flex min-h-svh flex-col">{children}</div>
    </SidebarProvider>
  );
}
