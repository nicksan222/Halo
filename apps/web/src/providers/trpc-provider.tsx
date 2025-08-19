/**
 * TRPC Provider Component
 *
 * Wraps the application with TRPC client capabilities.
 * Provides API client and query client for data fetching.
 */

import type { ReactNode } from 'react';
import { TRPCProvider } from '@/trpc/provider';

interface AppTRPCProviderProps {
  children: ReactNode;
}

export function AppTRPCProvider({ children }: AppTRPCProviderProps) {
  return <TRPCProvider>{children}</TRPCProvider>;
}
