import { authSchema, db } from '@acme/db';
import { env } from '@acme/env';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin as adminPlugin, organization, phoneNumber, username } from 'better-auth/plugins';
import { ac as accessControl, admin as adminRole, user as userRole } from './access-control';

const isLocal = env.NODE_ENV !== 'production';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', usePlural: true, schema: authSchema }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false // Set to true if you want to require email verification
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      // TODO: Implement email sending
      console.log(`Verification email for ${user.email}: ${url}`);
    }
  },
  user: {
    deleteUser: {
      enabled: isLocal
    },
    changeEmail: {
      enabled: true,
      sendChangeEmailVerification: async ({ user, newEmail, url }) => {
        // TODO: Implement email sending
        console.log(`Email change verification for ${user.email} to ${newEmail}: ${url}`);
      }
    }
  },

  plugins: [
    username(),
    organization(),
    phoneNumber(),
    adminPlugin({
      ac: accessControl,
      roles: {
        admin: adminRole,
        user: userRole
      }
    })
  ]
});
