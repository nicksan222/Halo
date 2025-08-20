import { authSchema, db } from '@acme/db';
import { env } from '@acme/env';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin as adminPlugin, organization, username } from 'better-auth/plugins';
import { ac as accessControl, admin as adminRole, user as userRole } from './access-control';

const isLocal = env.NODE_ENV !== 'production';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', usePlural: true, schema: authSchema }),
  emailAndPassword: { enabled: true },
  user: {
    deleteUser: {
      enabled: isLocal
    }
  },
  plugins: [
    username(),
    organization(),
    adminPlugin({
      ac: accessControl,
      roles: {
        admin: adminRole,
        user: userRole
      }
    })
  ]
});
