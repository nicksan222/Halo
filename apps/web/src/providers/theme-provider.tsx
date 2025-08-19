/**
 * Theme Provider Component
 *
 * Wraps the application with theme management capabilities.
 * Provides light/dark mode support with persistence.
 */

'use client';

import { ThemeProvider } from 'next-themes';
import type * as React from 'react';

interface AppThemeProviderProps {
  children: React.ReactNode;
}

export function AppThemeProvider({ children }: AppThemeProviderProps) {
  return (
    <div suppressHydrationWarning>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        storageKey="ownfit-theme"
        themes={['dark', 'light']}
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
    </div>
  );
}
