/**
 * Web Tailwind configuration factory.
 *
 * Crea una config per ogni app risolvendo i percorsi `content`
 * in **assoluto** a partire dalla cartella dell’app.
 */

import path from 'node:path';
import type { Config } from 'tailwindcss';
import baseTailwindPreset from './base';

/** Globs “logici” validi per tutte le web apps (Next/React) */
export const webContentGlobs = [
  // File dell’app
  './app/**/*.{ts,tsx,js,jsx,mdx}',
  './components/**/*.{ts,tsx,js,jsx,mdx}',
  './src/**/*.{ts,tsx,js,jsx,mdx}',

  // Pacchetti condivisi (sorgenti)
  '../../packages/ui-web/**/*.{ts,tsx,js,jsx,mdx}',
  '../../packages/*/src/**/*.{ts,tsx,js,jsx,mdx}',

  // (opzionale) se alcune app consumano il build del pacchetto
  '../../packages/ui-web/dist/**/*.{js,jsx}'
];

type Options = {
  /** Globs addizionali specifici dell’app */
  extraContent?: string[];
};

/**
 * @param appDir in genere `__dirname` della app
 * @param opts   opzioni (extraContent, safelist)
 */
export function createWebTailwindConfig(appDir: string, opts: Options = {}): Config {
  const toAbs = (p: string) => (p.startsWith('.') || p.startsWith('..') ? path.join(appDir, p) : p);

  const content = [...webContentGlobs, ...(opts.extraContent ?? [])].map(toAbs);

  return {
    // preset base condiviso (tema + plugin), nessun `content` nel preset
    presets: [baseTailwindPreset],
    darkMode: 'class',
    content
  };
}

export default createWebTailwindConfig;
