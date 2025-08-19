import { appRouter } from '@acme/api';
import { createContext } from '@acme/api/src/context';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';

const handler = (request: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: appRouter,
    createContext: async () => createContext({ headers: request.headers })
  });

export { handler as GET, handler as POST };
