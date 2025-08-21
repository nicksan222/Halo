import { authClient } from '@acme/auth/client';
import { create } from 'zustand';

// Define the session interface based on our UI needs
interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

// Define the store state interface
interface SessionsStore {
  // State
  sessions: Session[];
  isLoading: boolean;
  revokingSessionId: string | null;
  error: string | null;

  // Actions
  loadSessions: () => Promise<void>;
  revokeSession: (sessionId: string) => Promise<void>;
  revokeAllOtherSessions: () => Promise<void>;
  setRevokingSession: (sessionId: string | null) => void;
  clearError: () => void;
}

export const useSessionsStore = create<SessionsStore>((set, get) => ({
  // Initial state
  sessions: [],
  isLoading: false,
  revokingSessionId: null,
  error: null,

  // Actions
  loadSessions: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await authClient.listSessions();

      // Handle the result properly - it could be data or error
      if ('error' in result && result.error) {
        throw new Error(result.error.message || 'Failed to load sessions');
      }

      const sessionsData = 'data' in result ? result.data : result;
      const sessions: Session[] = (sessionsData ?? []).map((s: any) => ({
        id: s.token,
        device: s.userAgent || 'Unknown device',
        location: s.ipAddress || 'Unknown location',
        lastActive: s.expiresAt,
        isCurrent: Boolean(s.current)
      }));

      set({ sessions, isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load sessions',
        isLoading: false
      });
    }
  },

  revokeSession: async (sessionId: string) => {
    set({ revokingSessionId: sessionId, error: null });
    try {
      const result = await authClient.revokeSession({ token: sessionId });

      if ('error' in result && result.error) {
        throw new Error(result.error.message || 'Failed to revoke session');
      }

      // Reload sessions after successful revocation
      await get().loadSessions();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to revoke session'
      });
    } finally {
      set({ revokingSessionId: null });
    }
  },

  revokeAllOtherSessions: async () => {
    set({ error: null });
    try {
      const result = await authClient.revokeOtherSessions();

      if ('error' in result && result.error) {
        throw new Error(result.error.message || 'Failed to revoke sessions');
      }

      // Reload sessions after successful revocation
      await get().loadSessions();
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to revoke sessions'
      });
    }
  },

  setRevokingSession: (sessionId: string | null) => {
    set({ revokingSessionId: sessionId });
  },

  clearError: () => {
    set({ error: null });
  }
}));
