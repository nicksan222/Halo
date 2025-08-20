import { defineLang } from '@acme/localization';

export const lang = defineLang({
  metadata: {
    title: { en: 'Halo Todos', it: 'Halo Todos' },
    description: { en: 'Simple todos app', it: 'App semplice per attività' }
  },
  notFound: {
    title: { en: 'Page not found', it: 'Pagina non trovata' },
    description: {
      en: 'The page you are looking for does not exist.',
      it: 'La pagina che stai cercando non esiste.'
    }
  }
});
