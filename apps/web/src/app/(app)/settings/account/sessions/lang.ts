import { defineLang } from '@acme/localization';

export const lang = defineLang({
  cardTitle: { en: 'Active Sessions', it: 'Sessioni Attive' },
  currentSession: { en: 'Current Session', it: 'Sessione Corrente' },
  device: { en: 'Device', it: 'Dispositivo' },
  location: { en: 'Location', it: 'Posizione' },
  lastActive: { en: 'Last Active', it: 'Ultima Attività' },
  revoke: { en: 'Revoke', it: 'Revoca' },
  revokeAll: { en: 'Revoke All Other Sessions', it: 'Revoca Tutte le Altre Sessioni' },
  revokeSuccess: { en: 'Session revoked', it: 'Sessione revocata' },
  revokeAllSuccess: { en: 'All other sessions revoked', it: 'Tutte le altre sessioni revocate' },
  genericError: { en: 'Something went wrong', it: 'Qualcosa è andato storto' }
});
