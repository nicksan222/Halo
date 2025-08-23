import { defineLang } from '@acme/localization';

export const lang = defineLang({
  title: { en: 'Organization Settings', it: 'Impostazioni Organizzazione' },
  name: { en: 'Name', it: 'Nome' },
  namePlaceholder: { en: 'Acme Inc.', it: 'Acme Inc.' },
  slug: { en: 'Slug', it: 'Slug' },
  slugPlaceholder: { en: 'acme', it: 'acme' },
  save: { en: 'Save', it: 'Salva' },
  saving: { en: 'Saving...', it: 'Salvataggio...' },
  saved: { en: 'Saved', it: 'Salvato' },
  failedToSave: { en: 'Failed to save changes', it: 'Impossibile salvare le modifiche' }
});
