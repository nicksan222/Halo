import { defineLang } from '@acme/localization';

export const lang = defineLang({
  description: {
    en: 'Manage your organization settings',
    it: 'Gestisci le impostazioni della tua organizzazione'
  },
  tabs: {
    members: { en: 'Members', it: 'Membri' },
    membersDescription: {
      en: 'Manage organization members',
      it: "Gestisci i membri dell'organizzazione"
    },
    settings: { en: 'Settings', it: 'Impostazioni' },
    settingsDescription: { en: 'Organization settings', it: 'Impostazioni organizzazione' },
    billing: { en: 'Billing', it: 'Fatturazione' },
    billingDescription: { en: 'Billing and subscription', it: 'Fatturazione e abbonamento' },
    integrations: { en: 'Integrations', it: 'Integrazioni' },
    integrationsDescription: { en: 'Third-party integrations', it: 'Integrazioni di terze parti' },
    pendingInvitations: { en: 'Pending invitations', it: 'Inviti in attesa' },
    pendingInvitationsDescription: {
      en: 'View and manage invitations',
      it: 'Visualizza e gestisci inviti'
    },
    delete: { en: 'Delete', it: 'Elimina' },
    deleteDescription: { en: 'Delete organization', it: 'Elimina organizzazione' }
  },
  loading: { en: 'Loading…', it: 'Caricamento…' }
});
