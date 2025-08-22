import { healthRouter } from '../procedures/health';
import { notificationsRouter } from '../procedures/notifications';
import { profileRouter } from '../procedures/profile';
import { todosRouter } from '../procedures/todos';
import { router } from '../trpc';

export const appRouter = router({
  health: healthRouter,
  todos: todosRouter,
  notifications: notificationsRouter,
  profile: profileRouter
});

export type AppRouter = typeof appRouter;
