import { router } from '../../trpc';
import { notificationListRouter } from './list';
import { markNotificationsReadRouter } from './mark-read';
import { subscriptionsRouter } from './subscribe';

export const notificationsRouter = router({
  list: notificationListRouter,
  markRead: markNotificationsReadRouter,
  subscribe: subscriptionsRouter
});
