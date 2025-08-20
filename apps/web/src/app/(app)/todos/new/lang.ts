import { defineLang } from '@acme/localization';

export const lang = defineLang({
  title: { en: 'Create todo', it: 'Crea attività' },
  cardTitle: { en: 'New Todo', it: 'Nuova Attività' },
  titleLabel: { en: 'Title', it: 'Titolo' },
  titlePlaceholder: { en: 'e.g. Ship MVP', it: 'es. Lancia MVP' },
  titleRequired: { en: 'Title is required', it: 'Titolo richiesto' },
  descriptionLabel: { en: 'Description', it: 'Descrizione' },
  descriptionPlaceholder: { en: 'Optional details', it: 'Dettagli opzionali' },
  create: { en: 'Create', it: 'Crea' }
});
