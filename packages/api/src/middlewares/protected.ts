import { auth } from '@acme/auth';
import { TRPCError } from '@trpc/server';
import { publicProcedure } from './public';

/**
 * Protected tRPC procedure.
 *
 * - Builds on top of `publicProcedure` to ensure a valid authenticated session.
 * - Augments the context with the authenticated `user`.
 *
 * Context after this middleware:
 * - `ctx.db`: Drizzle database client (inherited from `publicProcedure`)
 * - `ctx.headers`: Request headers passed from the server context
 * - `ctx.user`: Authenticated user (non-null)
 */
const protectedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  const { headers = {} } = ctx;

  const normalizedHeaders =
    typeof Headers !== 'undefined' && headers instanceof Headers
      ? headers
      : new Headers(headers ?? {});

  const session = await auth.api.getSession({
    headers: normalizedHeaders
  });

  if (!session) {
    throw new TRPCError({ code: 'UNAUTHORIZED' });
  }

  return next({
    ctx: {
      ...ctx,
      auth,
      session
    }
  });
});

export { protectedProcedure };
