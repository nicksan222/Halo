import { healthRouter } from '../procedures/health';
import { notificationsRouter } from '../procedures/notifications';
import { todosRouter } from '../procedures/todos';
import { router } from '../trpc';

export const appRouter = router({
  health: healthRouter,
  todos: todosRouter,
  notifications: notificationsRouter
});

export type AppRouter = typeof appRouter;
