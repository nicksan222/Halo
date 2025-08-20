'use client';

import type { ReactNode } from 'react';
import { I18nProvider } from './i18n-provider';
import { AppThemeProvider } from './theme-provider';
import { AppTRPCProvider } from './trpc-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppTRPCProvider>
      <AppThemeProvider>
        <I18nProvider>{children}</I18nProvider>
      </AppThemeProvider>
    </AppTRPCProvider>
  );
}
