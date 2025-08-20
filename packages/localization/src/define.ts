import { type SupportedLocale, SupportedLocales } from './locales';

export type TranslationLeaf = Record<SupportedLocale, string>;
export type DeepTranslationObject = { [key: string]: DeepTranslationObject | TranslationLeaf };

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isTranslationLeaf(value: unknown): value is TranslationLeaf {
  if (!isObject(value)) return false;
  // Ensure exactly the supported locales and string values
  const keys = Object.keys(value);
  if (keys.length !== SupportedLocales.length) return false;
  for (const loc of SupportedLocales) {
    if (!(loc in (value as any))) return false;
    if (typeof (value as any)[loc] !== 'string') return false;
  }
  return true;
}

function validateDeep(obj: unknown, path: string[] = []): void {
  if (!isObject(obj)) {
    throw new Error(`Invalid translations at ${path.join('.')} - expected object`);
  }
  for (const [key, val] of Object.entries(obj)) {
    const nextPath = [...path, key];
    if (isObject(val)) {
      if (isTranslationLeaf(val)) continue;
      validateDeep(val, nextPath);
      continue;
    }
    throw new Error(`Invalid translations at ${nextPath.join('.')} - expected translation leaf`);
  }
}

export function defineLang<T extends DeepTranslationObject>(value: T): T {
  validateDeep(value);
  return value;
}
