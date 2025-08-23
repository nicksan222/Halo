'use client';

import type { ReactNode } from 'react';
import { I18nProvider, type Locale } from '@/localization/next';
import { AppThemeProvider } from './theme-provider';
import { AppTRPCProvider } from './trpc-provider';

export function Providers({
  children,
  initialLocale
}: {
  children: ReactNode;
  initialLocale?: Locale;
}) {
  return (
    <AppTRPCProvider>
      <AppThemeProvider>
        <I18nProvider initialLocale={initialLocale}>{children}</I18nProvider>
      </AppThemeProvider>
    </AppTRPCProvider>
  );
}
