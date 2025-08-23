import { defineLang } from '@acme/localization';

export const lang = defineLang({
  title: { en: 'Account settings', it: 'Impostazioni account' },
  description: {
    en: 'Manage your profile, security, and account settings.',
    it: 'Gestisci profilo, sicurezza e impostazioni account.'
  },
  tabs: {
    profile: { en: 'Profile', it: 'Profilo' },
    profileDescription: {
      en: 'Update your name and avatar',
      it: 'Aggiorna nome e avatar'
    },
    security: { en: 'Security', it: 'Sicurezza' },
    securityDescription: {
      en: 'Change email and password',
      it: 'Cambia email e password'
    },
    language: { en: 'Language', it: 'Lingua' },
    languageDescription: {
      en: 'Choose your preferred language',
      it: 'Scegli la tua lingua preferita'
    },

    sessions: { en: 'Sessions', it: 'Sessioni' },
    sessionsDescription: {
      en: 'Manage active sessions',
      it: 'Gestisci sessioni attive'
    },
    verification: { en: 'Verification', it: 'Verifica' },
    verificationDescription: {
      en: 'Email and phone verification',
      it: 'Verifica email e telefono'
    },
    danger: { en: 'Danger zone', it: 'Zona pericolosa' },
    dangerDescription: {
      en: 'Delete your account',
      it: 'Elimina il tuo account'
    }
  },
  profile: {
    cardTitle: { en: 'Profile', it: 'Profilo' },
    nameLabel: { en: 'Name', it: 'Nome' },
    namePlaceholder: { en: 'e.g. John Doe', it: 'es. Mario Rossi' },
    imageLabel: { en: 'Avatar URL', it: 'URL Avatar' },
    imagePlaceholder: { en: 'https://…', it: 'https://…' },
    save: { en: 'Save', it: 'Salva' },
    success: { en: 'Profile updated', it: 'Profilo aggiornato' }
  },
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

  sessions: {
    cardTitle: { en: 'Active Sessions', it: 'Sessioni Attive' },
    currentSession: { en: 'Current Session', it: 'Sessione Corrente' },
    device: { en: 'Device', it: 'Dispositivo' },
    location: { en: 'Location', it: 'Posizione' },
    lastActive: { en: 'Last Active', it: 'Ultima Attività' },
    revoke: { en: 'Revoke', it: 'Revoca' },
    revokeAll: { en: 'Revoke All Other Sessions', it: 'Revoca Tutte le Altre Sessioni' },
    revokeSuccess: { en: 'Session revoked', it: 'Sessione revocata' },
    revokeAllSuccess: { en: 'All other sessions revoked', it: 'Tutte le altre sessioni revocate' }
  },
  verification: {
    cardTitle: { en: 'Verification', it: 'Verifica' },
    emailVerification: { en: 'Email Verification', it: 'Verifica Email' },
    emailVerified: { en: 'Email verified', it: 'Email verificata' },
    emailUnverified: { en: 'Email not verified', it: 'Email non verificata' },
    resendEmail: { en: 'Resend verification email', it: 'Rinvia email di verifica' },
    phoneVerification: { en: 'Phone Verification', it: 'Verifica Telefono' },
    phoneLabel: { en: 'Phone Number', it: 'Numero di Telefono' },
    phonePlaceholder: { en: '+1 (555) 123-4567', it: '+39 123 456 7890' },
    addPhone: { en: 'Add phone number', it: 'Aggiungi numero di telefono' },
    verifyPhone: { en: 'Verify phone', it: 'Verifica telefono' },
    phoneVerified: { en: 'Phone verified', it: 'Telefono verificato' },
    phoneUnverified: { en: 'Phone not verified', it: 'Telefono non verificato' },
    resendSMS: { en: 'Resend SMS', it: 'Rinvia SMS' },
    success: { en: 'Verification sent', it: 'Verifica inviata' }
  },
  danger: {
    cardTitle: { en: 'Danger zone', it: 'Zona pericolosa' },
    deleteAccount: { en: 'Delete account', it: 'Elimina account' },
    deleteDescription: {
      en: 'This will permanently delete your account and data.',
      it: 'Questo eliminerà definitivamente il tuo account e i dati.'
    },
    confirmPlaceholder: { en: 'Type DELETE to confirm', it: 'Scrivi ELIMINA per confermare' },
    confirmWord: { en: 'DELETE', it: 'ELIMINA' },
    delete: { en: 'Delete', it: 'Elimina' }
  },
  notifications: {
    genericError: { en: 'Something went wrong', it: 'Qualcosa è andato storto' }
  }
});
