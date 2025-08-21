import { defineLang } from '@acme/localization';

export const lang = defineLang({
  cardTitle: { en: 'Danger zone', it: 'Zona pericolosa' },
  deleteAccount: { en: 'Delete account', it: 'Elimina account' },
  deleteDescription: {
    en: 'This will permanently delete your account and data.',
    it: 'Questo eliminerà definitivamente il tuo account e i dati.'
  },
  confirmPlaceholder: { en: 'Type DELETE to confirm', it: 'Scrivi ELIMINA per confermare' },
  confirmWord: { en: 'DELETE', it: 'ELIMINA' },
  delete: { en: 'Delete', it: 'Elimina' },
  genericError: { en: 'Something went wrong', it: 'Qualcosa è andato storto' }
});
