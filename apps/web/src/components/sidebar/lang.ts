import { defineLang } from '@acme/localization';

export const sidebarLang = defineLang({
  sidebar: {
    application: { en: 'Application', it: 'Applicazione' },
    todos: { en: 'Todos', it: 'Attività' },
    newTodo: { en: 'New Todo', it: 'Nuova Attività' },
    organizationNamePrompt: { en: 'Organization name', it: 'Nome organizzazione' },
    freePlan: { en: 'Free', it: 'Gratis' },
    // NavUser labels
    upgradeToPro: { en: 'Upgrade to Pro', it: 'Passa a Pro' },
    account: { en: 'Account', it: 'Account' },
    billing: { en: 'Billing', it: 'Fatturazione' },
    navNotifications: { en: 'Notifications', it: 'Notifiche' },
    logOut: { en: 'Log out', it: 'Esci' }
  },
  notifications: {
    notifications: { en: 'Notifications', it: 'Notifiche' },
    markAllRead: { en: 'Mark all read', it: 'Segna tutte come lette' },
    noNotifications: { en: 'No notifications', it: 'Nessuna notifica' },
    noNotificationsDescription: {
      en: "You're all caught up. We'll let you know when there's something new.",
      it: 'Sei aggiornato. Ti avviseremo quando ci sarà qualcosa di nuovo.'
    },
    notificationSettings: { en: 'Notification settings', it: 'Impostazioni notifiche' },
    markReadSuccess: { en: 'Notifications marked as read', it: 'Notifiche segnate come lette' },
    markReadError: {
      en: 'Failed to mark notifications as read',
      it: 'Impossibile segnare le notifiche come lette'
    },
    justNow: { en: 'Just now', it: 'Proprio ora' },
    minutesAgo: { en: 'm ago', it: 'm fa' },
    hoursAgo: { en: 'h ago', it: 'h fa' },
    daysAgo: { en: 'd ago', it: 'g fa' }
  }
});
