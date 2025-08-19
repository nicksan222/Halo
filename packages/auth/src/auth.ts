import { authSchema, db } from '@acme/db';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin as adminPlugin, organization, username } from 'better-auth/plugins';
import { ac as accessControl, admin as adminRole, user as userRole } from './access-control';

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: 'pg', usePlural: true, schema: authSchema }),
  emailAndPassword: { enabled: true },
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
