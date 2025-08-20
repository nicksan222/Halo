'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { LocaleHookResult, SupportedLocale } from '../locales';
import { SupportedLocales } from '../locales';

export type UseLocaleOptions = {
  cookieName?: string;
  defaultLocale?: SupportedLocale;
};

export function useLocale(options?: UseLocaleOptions): LocaleHookResult {
  const cookieName = options?.cookieName ?? 'locale';
  const fallback = options?.defaultLocale ?? 'en';

  const initial = useMemo(() => {
    const fromCookie = normalizeLocale(readCookie(cookieName), fallback);
    if (fromCookie) return fromCookie;
    if (typeof navigator !== 'undefined') {
      return normalizeLocale(navigator.language, fallback);
    }
    return fallback;
  }, [cookieName, fallback]);

  const [locale, setLocaleState] = useState<SupportedLocale>(initial);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback(
    (next: SupportedLocale) => {
      if (typeof document !== 'undefined') {
        // biome-ignore lint/suspicious/noDocumentCookie: Must be used in client
        document.cookie = `${cookieName}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
      }
      setLocaleState(next);
    },
    [cookieName]
  );

  return { locale, setLocale };
}

function readCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  return document.cookie
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${name}=`))
    ?.split('=')?.[1];
}

function normalizeLocale(value: string | undefined, fallback: SupportedLocale): SupportedLocale {
  if (!value) return fallback;
  if ((SupportedLocales as readonly string[]).includes(value)) return value as SupportedLocale;
  const lower = value.toLowerCase();
  if (lower.startsWith('it')) return 'it';
  return fallback;
}
