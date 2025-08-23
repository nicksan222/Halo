import { defineLang } from '@acme/localization';

export const lang = defineLang({
  title: { en: 'Delete Organization', it: 'Elimina Organizzazione' },
  description: {
    en: 'This action cannot be undone. Type DELETE to confirm.',
    it: 'Questa azione non può essere annullata. Scrivi ELIMINA per confermare.'
  },
  confirmation: { en: 'Confirmation', it: 'Conferma' },
  confirmationPlaceholder: { en: 'DELETE', it: 'ELIMINA' },
  delete: { en: 'Delete Organization', it: 'Elimina Organizzazione' },
  deleting: { en: 'Deleting...', it: 'Eliminazione...' },
  failedToDelete: {
    en: 'Failed to delete organization',
    it: "Impossibile eliminare l'organizzazione"
  }
});
