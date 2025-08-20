import type { LocaleHookResult, SupportedLocale } from '../locales';
import { SupportedLocales } from '../locales';

export type UseServerLocaleOptions = {
  cookieName?: string;
  defaultLocale?: SupportedLocale;
};

export type ServerCookies = {
  get: (name: string) => string | undefined;
  set?: (name: string, value: string) => void;
};

function normalizeLocale(value: string | undefined, fallback: SupportedLocale): SupportedLocale {
  if (!value) return fallback;
  if ((SupportedLocales as readonly string[]).includes(value)) return value as SupportedLocale;
  const lower = value.toLowerCase();
  if (lower.startsWith('it')) return 'it';
  return fallback;
}

export function useLocale(
  req: { headers: Headers; cookies: ServerCookies },
  options?: UseServerLocaleOptions
): LocaleHookResult {
  const cookieName = options?.cookieName ?? 'locale';
  const fallback = options?.defaultLocale ?? 'en';

  const fromCookie = req.cookies.get(cookieName);
  const accept = req.headers.get('accept-language') ?? '';
  const locale = normalizeLocale(fromCookie ?? accept, fallback);

  function setLocale(next: SupportedLocale) {
    if (typeof req.cookies.set === 'function') {
      req.cookies.set(cookieName, next);
    }
  }

  return { locale, setLocale };
}

export const __isModule = true;
