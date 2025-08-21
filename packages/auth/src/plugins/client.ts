import { createAuthClient } from 'better-auth/react';
import { ac as accessControl, admin as adminRole, user as userRole } from '../access-control';
import { adminClient, organizationClient, phoneNumberClient, usernameClient } from './index';

// Auto-detect API base URL: prefer NEXT_PUBLIC_API_URL, fallback to current origin
const baseURL =
  typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL
    : typeof window !== 'undefined'
      ? window.location.origin
      : undefined;

export const authClient = createAuthClient({
  baseURL,
  fetchOptions: {
    credentials: 'include'
  },
  plugins: [
    organizationClient(),
    adminClient({
      ac: accessControl,
      roles: {
        admin: adminRole,
        user: userRole
      }
    }),
    usernameClient(),
    phoneNumberClient()
  ]
});

export type AuthClient = typeof authClient;
