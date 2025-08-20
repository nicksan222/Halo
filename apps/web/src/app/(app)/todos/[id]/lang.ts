import { defineLang } from '@acme/localization';

export const lang = defineLang({
  title: { en: 'Edit todo', it: 'Modifica attività' },
  cardTitle: { en: 'Details', it: 'Dettagli' },
  titleLabel: { en: 'Title', it: 'Titolo' },
  titleRequired: { en: 'Title is required', it: 'Titolo richiesto' },
  descriptionLabel: { en: 'Description', it: 'Descrizione' },
  completed: { en: 'Completed', it: 'Completata' },
  save: { en: 'Save', it: 'Salva' },
  cancel: { en: 'Cancel', it: 'Annulla' },
  loading: { en: 'Loading…', it: 'Caricamento…' },
  loadError: { en: 'Failed to load todo', it: "Impossibile caricare l'attività" },
  loadErrorDescription: {
    en: 'An error occurred while loading the todo',
    it: "Si è verificato un errore durante il caricamento dell'attività"
  },
  back: { en: 'Back', it: 'Indietro' }
});
