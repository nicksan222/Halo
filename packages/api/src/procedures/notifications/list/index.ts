import { notifications } from '@acme/db/src/schema/notifications';
import { and, desc, eq, isNotNull, isNull } from 'drizzle-orm';
import { protectedProcedure } from '../../../middlewares/protected';
import { router } from '../../../trpc';
import { listNotificationsInput } from './input';

export const notificationListRouter = router({
  all: protectedProcedure.input(listNotificationsInput).query(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(notifications.userId, input.userId ?? session.user.id)];

    if (typeof input.isRead === 'boolean') {
      if (input.isRead) {
        conditions.push(isNotNull(notifications.readAt));
      } else {
        conditions.push(isNull(notifications.readAt));
      }
    }

    if (input.type) {
      conditions.push(eq(notifications.type, input.type));
    }

    if (input.severity) {
      conditions.push(eq(notifications.severity, input.severity));
    }

    const rows = await db
      .select()
      .from(notifications)
      .where(and(...conditions))
      .orderBy(desc(notifications.createdAt), desc(notifications.title))
      .limit(limit)
      .offset(offset);

    // Parse metadata JSON for each notification
    const notificationsWithParsedMetadata = rows.map((notification) => ({
      ...notification,
      metadata: notification.metadata ? JSON.parse(notification.metadata) : null
    }));

    return notificationsWithParsedMetadata;
  })
});
