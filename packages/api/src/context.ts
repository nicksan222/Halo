import type { auth } from '@acme/auth';

type Session = typeof auth.$Infer.Session.session;
type User = typeof auth.$Infer.Session.user;

export type Context = {
  headers?: Headers | Record<string, string>;
  session?: Session;
  user?: User;
};

export async function createContext(
  opts: { headers?: Headers | Record<string, string>; session?: Session; user?: User } = {}
): Promise<Context> {
  return {
    headers: opts.headers,
    session: opts.session,
    user: opts.user
  };
}
