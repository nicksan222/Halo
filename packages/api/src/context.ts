import type { auth } from '@acme/auth';

type Session = typeof auth.$Infer.Session.session;
type User = typeof auth.$Infer.Session.user;

export type Context = {
  headers?: Headers | Record<string, string>;
  session?: Session;
  user?: User;
  /**
   * Marks the request as internal-only. Used by `internalProcedure` to gate access.
   * Not set for external callers.
   */
  isInternal?: boolean;
  /**
   * Factory to create a tRPC caller marked as internal-only, reusing the current ctx.
   * Allows calling internal endpoints without exposing them externally.
   */
  createInternalCaller?: <TRouter extends { createCaller: (ctx: unknown) => any }>(
    router: TRouter
  ) => Promise<ReturnType<TRouter['createCaller']>>;
};

export async function createContext(
  opts: {
    headers?: Headers | Record<string, string>;
    session?: Session;
    user?: User;
    isInternal?: boolean;
  } = {}
): Promise<Context> {
  return {
    headers: opts.headers,
    session: opts.session,
    user: opts.user,
    isInternal: opts.isInternal
  };
}
