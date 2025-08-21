import type { auth } from '@acme/auth';
import { authClient } from '@acme/auth/client';
import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Get proper types from Better Auth
type Session = typeof auth.$Infer.Session;

// Zustand store for offline-first session management
interface SessionStore {
  session: Session | null;
  isPending: boolean;
  lastUpdated: number | null;
  setSession: (session: Session | null) => void;
  setPending: (isPending: boolean) => void;
  updateSession: () => Promise<void>;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, _get) => ({
      session: null,
      isPending: false,
      lastUpdated: null,
      setSession: (session) => set({ session, lastUpdated: Date.now() }),
      setPending: (isPending) => set({ isPending }),
      updateSession: async () => {
        set({ isPending: true });
        try {
          const { data } = await authClient.getSession();
          set({ session: data, isPending: false, lastUpdated: Date.now() });
        } catch (_error) {
          set({ isPending: false });
        }
      }
    }),
    {
      name: 'session-storage',
      partialize: (state) => ({
        session: state.session,
        lastUpdated: state.lastUpdated
      })
    }
  )
);

// Custom offline-first session hook using Zustand
export function useOfflineFirstSession() {
  const { session, isPending, setSession, setPending, updateSession } = useSessionStore();
  const { data: liveSession, isPending: isLivePending } = authClient.useSession();

  useEffect(() => {
    // Initialize with cached data immediately
    if (!session) {
      updateSession();
    }
  }, [session, updateSession]);

  useEffect(() => {
    // Update store when live session changes
    if (liveSession && liveSession !== session) {
      setSession(liveSession);
    }
  }, [liveSession, session, setSession]);

  useEffect(() => {
    // Sync pending state
    setPending(isLivePending);
  }, [isLivePending, setPending]);

  return {
    data: session,
    isPending: isPending && !session, // Only show loading if no cached data
    refetch: updateSession
  };
}
