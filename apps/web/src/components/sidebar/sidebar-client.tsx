'use client';

import type { SupportedLocale } from '@acme/localization';
import { translate } from '@acme/localization';
import { AppSidebar } from '@/components/sidebar/app-sidebar';
import { useLocale } from '@/localization/next';
import { lang } from '../../app/(app)/lang';

interface Labels {
  application?: string;
  todos?: string;
  newTodo?: string;
  teamNamePrompt?: string;
  freePlan?: string;
  notifications?: string;
  markAllRead?: string;
  noNotifications?: string;
  noNotificationsDescription?: string;
  notificationSettings?: string;
  markReadSuccess?: string;
  markReadError?: string;
  justNow?: string;
  minutesAgo?: string;
  hoursAgo?: string;
  daysAgo?: string;
}

export function ClientSidebar({ initialLabels }: { initialLabels: Labels }) {
  const locale = useLocale() as SupportedLocale;
  const t = translate(lang, locale);

  const labels: Labels = {
    application: t.sidebar.application,
    todos: t.sidebar.todos,
    newTodo: t.sidebar.newTodo,
    teamNamePrompt: t.sidebar.teamNamePrompt,
    freePlan: t.sidebar.freePlan,
    notifications: t.notifications.notifications,
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
  };

  return <AppSidebar labels={{ ...initialLabels, ...labels }} />;
}
