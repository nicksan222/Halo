import { defineLang } from '@acme/localization';

export const lang = defineLang({
  email: {
    cardTitle: { en: 'Email', it: 'Email' },
    emailLabel: { en: 'New email', it: 'Nuova email' },
    emailPlaceholder: { en: 'name@example.com', it: 'nome@esempio.com' },
    change: { en: 'Change email', it: 'Cambia email' },
    success: { en: 'Email change requested', it: 'Cambio email richiesto' }
  },
  password: {
    cardTitle: { en: 'Password', it: 'Password' },
    currentLabel: { en: 'Current password', it: 'Password attuale' },
    newLabel: { en: 'New password', it: 'Nuova password' },
    confirmLabel: { en: 'Confirm new password', it: 'Conferma nuova password' },
    change: { en: 'Change password', it: 'Cambia password' },
    mismatch: { en: 'Passwords do not match', it: 'Le password non coincidono' },
    success: { en: 'Password updated', it: 'Password aggiornata' }
  },
  genericError: { en: 'Something went wrong', it: 'Qualcosa è andato storto' }
});
