'use client';

import type { ReactNode } from 'react';
import { AppThemeProvider } from './theme-provider';
import { AppTRPCProvider } from './trpc-provider';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppTRPCProvider>
      <AppThemeProvider>{children}</AppThemeProvider>
    </AppTRPCProvider>
  );
}
