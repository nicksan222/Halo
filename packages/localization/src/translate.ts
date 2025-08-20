import type { DeepTranslationObject, TranslationLeaf } from './define';
import type { SupportedLocale } from './locales';

export type ResolvedTranslations<T> = T extends TranslationLeaf
  ? string
  : T extends Record<string, any>
    ? { [K in keyof T]: ResolvedTranslations<T[K]> }
    : never;

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isLeaf(value: unknown): value is TranslationLeaf {
  if (!isObject(value)) return false;
  // Heuristic: leaf should have string values
  return Object.values(value).every((v) => typeof v === 'string');
}

export function translate<T extends DeepTranslationObject>(
  obj: T,
  locale: SupportedLocale
): ResolvedTranslations<T> {
  function walk(node: any): any {
    if (isLeaf(node)) return node[locale];
    const out: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(node)) {
      out[key] = walk(val);
    }
    return out;
  }
  return walk(obj) as ResolvedTranslations<T>;
}
