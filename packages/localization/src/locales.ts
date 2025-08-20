import { type ZodTypeAny, z } from 'zod';

export type LocaleCode = 'en' | 'it';

export const SupportedLocales = ['en', 'it'] as const satisfies readonly LocaleCode[];

export type SupportedLocale = (typeof SupportedLocales)[number];

export type TranslationShape<TLocales extends readonly string[]> = {
  [K in TLocales[number]]: string;
};

export function createTranslationSchema<TLocales extends readonly string[]>(locales: TLocales) {
  return z.object(
    locales.reduce<Record<string, ZodTypeAny>>((acc, loc) => {
      acc[loc] = z.string();
      return acc;
    }, {})
  ) as z.ZodObject<{ [K in TLocales[number]]: z.ZodString }>;
}

export function zWithTranslation<TLocales extends readonly string[]>(locales: TLocales) {
  return Object.assign(z, {
    translation: () => createTranslationSchema(locales)
  });
}

export type LocaleHookResult = {
  locale: SupportedLocale;
  setLocale: (next: SupportedLocale) => void;
};
