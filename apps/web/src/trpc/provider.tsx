'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink, httpLink, httpSubscriptionLink, loggerLink, splitLink } from '@trpc/client';
import type React from 'react';
import { useState } from 'react';
import superjson from 'superjson';
import { api } from './react';

function getBaseUrl() {
  if (typeof window !== 'undefined') return '';
  return process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    api.createClient({
      links: [
        loggerLink(),
        // Route subscription ops over SSE, others continue to use existing split (FormData vs batch)
        splitLink({
          condition: (op) => op.type === 'subscription',
          true: httpSubscriptionLink({
            transformer: superjson,
            url: `${getBaseUrl()}/api/trpc`,
            // ensure cookies are sent for auth
            eventSourceOptions() {
              return { withCredentials: true } as EventSourceInit;
            }
          }),
          false: splitLink({
            condition: (op) => op.input instanceof FormData,
            true: httpLink({
              transformer: superjson,
              url: `${getBaseUrl()}/api/trpc`,
              fetch: (input, init) =>
                fetch(input, {
                  ...init,
                  credentials: 'include'
                })
            }),
            false: httpBatchLink({
              transformer: superjson,
              url: `${getBaseUrl()}/api/trpc`,
              fetch: (input, init) =>
                fetch(input, {
                  ...init,
                  credentials: 'include'
                })
            })
          })
        })
      ]
    })
  );

  return (
    <api.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </api.Provider>
  );
}
