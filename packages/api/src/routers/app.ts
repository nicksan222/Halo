import { healthRouter } from '../procedures/health';
import { todosRouter } from '../procedures/todos';
import { router } from '../trpc';

export const appRouter = router({
  health: healthRouter,
  todos: todosRouter
});

export type AppRouter = typeof appRouter;
