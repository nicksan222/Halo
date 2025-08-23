'use client';

import { createContext, type ReactNode, useContext } from 'react';
import type { SupportedLocale } from '../locales';
import { useLocale as useClientLocale } from './next-client';

export type Locale = SupportedLocale;

interface I18nContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  children,
  initialLocale
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  const { locale, setLocale } = useClientLocale({ defaultLocale: initialLocale });
  const value: I18nContextValue = { locale, setLocale };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useContextLocale(): Locale {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useContextLocale must be used within I18nProvider');
  return ctx.locale;
}

export function useSetContextLocale(): (next: Locale) => void {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useSetContextLocale must be used within I18nProvider');
  return ctx.setLocale;
}

export function selectByLocale<T>(locale: Locale, map: Record<Locale, T>): T {
  return map[locale];
}
