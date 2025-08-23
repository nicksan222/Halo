'use client';

import type { SupportedLocale } from '@acme/localization';
import { useLocale as useClientLocale } from '@acme/localization/next-client';
import { createContext, type ReactNode, useContext } from 'react';

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

export function useLocale(): Locale {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useLocale must be used within I18nProvider');
  return ctx.locale;
}

export function useSetLocale(): (next: Locale) => void {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useSetLocale must be used within I18nProvider');
  return ctx.setLocale;
}

export function selectByLocale<T>(locale: Locale, map: Record<Locale, T>): T {
  return map[locale];
}
