import { defineLang } from '@acme/localization';

export const lang = defineLang({
  metadata: {
    title: { en: 'Halo Todos', it: 'Halo Todos' },
    description: { en: 'Simple todos app', it: 'App semplice per attività' }
  },
  notFound: {
    title: { en: 'Page not found', it: 'Pagina non trovata' },
    description: {
      en: 'The page you are looking for does not exist.',
      it: 'La pagina che stai cercando non esiste.'
    }
  },
  sidebar: {
    application: { en: 'Application', it: 'Applicazione' },
    todos: { en: 'Todos', it: 'Attività' },
    newTodo: { en: 'New Todo', it: 'Nuova Attività' },
    teamNamePrompt: { en: 'Team name', it: 'Nome del team' },
    freePlan: { en: 'Free', it: 'Gratuito' },
    notifications: { en: 'Notifications', it: 'Notifiche' },
    markAllRead: { en: 'Mark all as read', it: 'Segna tutto come letto' },
    noNotifications: { en: 'No notifications', it: 'Nessuna notifica' },
    noNotificationsDescription: { en: "You're all caught up!", it: 'Sei aggiornato!' },
    notificationSettings: { en: 'Notification settings', it: 'Impostazioni notifiche' },
    markReadSuccess: { en: 'Marked as read', it: 'Segnato come letto' },
    markReadError: { en: 'Failed to mark as read', it: 'Impossibile segnare come letto' },
    justNow: { en: 'Just now', it: 'Adesso' },
    minutesAgo: { en: 'minutes ago', it: 'minuti fa' },
    hoursAgo: { en: 'hours ago', it: 'ore fa' },
    daysAgo: { en: 'days ago', it: 'giorni fa' },
    // NavUser labels
    upgradeToPro: { en: 'Upgrade to Pro', it: 'Passa a Pro' },
    account: { en: 'Account', it: 'Account' },
    billing: { en: 'Billing', it: 'Fatturazione' },
    navNotifications: { en: 'Notifications', it: 'Notifiche' },
    logOut: { en: 'Log out', it: 'Esci' }
  }
});
