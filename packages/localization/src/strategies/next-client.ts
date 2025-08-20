import type { SupportedLocale } from '../locales';

export interface NextClientStrategy {
  getLocale(): SupportedLocale;
  setLocale(next: SupportedLocale): void;
}

export class NextClientLocaleStrategy implements NextClientStrategy {
  private cookieName: string;
  private fallback: SupportedLocale;

  constructor(options?: { cookieName?: string; defaultLocale?: SupportedLocale }) {
    this.cookieName = options?.cookieName ?? 'locale';
    this.fallback = options?.defaultLocale ?? 'en';
  }

  getLocale(): SupportedLocale {
    if (typeof document !== 'undefined') {
      const cookie = document.cookie
        .split(';')
        .map((c) => c.trim())
        .find((c) => c.startsWith(`${this.cookieName}=`))
        ?.split('=')?.[1] as SupportedLocale | undefined;
      if (cookie) return cookie;
    }
    if (typeof navigator !== 'undefined') {
      const lang = navigator.language?.toLowerCase?.() ?? this.fallback;
      if (lang.startsWith('it')) return 'it';
    }
    return this.fallback;
  }

  setLocale(next: SupportedLocale): void {
    if (typeof document !== 'undefined') {
      // biome-ignore lint/suspicious/noDocumentCookie: Cookie is set on the client
      document.cookie = `${this.cookieName}=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
      document.documentElement.lang = next;
    }
  }
}
