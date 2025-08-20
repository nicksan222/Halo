import type { SupportedLocale } from '../locales';

export interface NextServerStrategy {
  getLocale(): SupportedLocale;
}

export class NextServerLocaleStrategy implements NextServerStrategy {
  private cookieName: string;
  private fallback: SupportedLocale;
  private headers: Headers;
  private cookies: { get: (name: string) => string | undefined };

  constructor(
    requestHeaders: Headers,
    requestCookies: { get: (name: string) => string | undefined },
    options?: { cookieName?: string; defaultLocale?: SupportedLocale }
  ) {
    this.headers = requestHeaders;
    this.cookies = requestCookies;
    this.cookieName = options?.cookieName ?? 'locale';
    this.fallback = options?.defaultLocale ?? 'en';
  }

  getLocale(): SupportedLocale {
    const fromCookie = this.cookies.get(this.cookieName);
    if (fromCookie && (fromCookie === 'en' || fromCookie === 'it')) {
      return fromCookie as SupportedLocale;
    }
    const accept = this.headers.get('accept-language')?.toLowerCase?.() ?? '';
    if (accept.startsWith('it')) return 'it';
    return this.fallback;
  }
}
