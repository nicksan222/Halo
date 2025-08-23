export { SupportedLocales, zWithTranslation } from '../locales';
export { useLocale } from './next-client';
export { useLocale as useServerLocale } from './next-server';

// React provider for Next.js client to share locale via context
export { I18nProvider, selectByLocale, useContextLocale, useSetContextLocale } from './provider';
