import { TRPCError } from '@trpc/server';
import { publicProcedure } from './public';

/**
 * Internal-only tRPC procedure.
 *
 * - Builds on top of `publicProcedure` so `db` and `auth` are present in ctx.
 * - Requires `ctx.isInternal === true` which is only set when using an internal caller.
 * - Prevents external access from HTTP callers.
 */
export const internalProcedure = publicProcedure.use(async ({ ctx, next }) => {
  if (!ctx || (ctx as any).isInternal !== true) {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Internal-only endpoint' });
  }
  return next();
});
