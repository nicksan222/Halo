import { defineLang } from '@acme/localization';

export const lang = defineLang({
  cardTitle: { en: 'Profile', it: 'Profilo' },
  nameLabel: { en: 'Name', it: 'Nome' },
  namePlaceholder: { en: 'e.g. John Doe', it: 'es. Mario Rossi' },
  imageLabel: { en: 'Avatar URL', it: 'URL Avatar' },
  imagePlaceholder: { en: 'https://…', it: 'https://…' },
  save: { en: 'Save', it: 'Salva' },
  success: { en: 'Profile updated', it: 'Profilo aggiornato' },
  genericError: { en: 'Something went wrong', it: 'Qualcosa è andato storto' }
});
