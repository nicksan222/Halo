import { auth } from '@acme/auth';
import { db } from '@acme/db';
import { t } from '../trpc';

/**
 * Public tRPC procedure.
 *
 * - Extends the base context with the shared database client `db`.
 * - Use this as the starting point for routes that do not require authentication.
 *
 * Context after this middleware:
 * - `ctx.db`: Drizzle database client
 */
const baseProcedure = t.procedure.use(async ({ ctx, next }) => {
  return next({
    ctx: {
      ...ctx,
      db,
      auth
    }
  });
});

export const publicProcedure = baseProcedure;
