import { notifications } from '@acme/db/src/schema/notifications';
import { and, eq, isNull, lte } from 'drizzle-orm';
import { protectedProcedure } from '../../../middlewares/protected';
import { router } from '../../../trpc';
import { markNotificationsReadInput } from './input';

export const markNotificationsReadRouter = router({
  batch: protectedProcedure.input(markNotificationsReadInput).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const now = new Date();
    const conditions = [
      eq(notifications.userId, session.user.id),
      isNull(notifications.readAt) // Only mark unread notifications
    ];

    // If latestReadId is provided, mark all notifications up to and including that ID
    if (input.latestReadId) {
      conditions.push(lte(notifications.id, input.latestReadId));
    }

    // Optional type filter
    if (input.type) {
      conditions.push(eq(notifications.type, input.type));
    }

    // Optional severity filter
    if (input.severity) {
      conditions.push(eq(notifications.severity, input.severity));
    }

    const result = await db
      .update(notifications)
      .set({
        isRead: true,
        readAt: now,
        updatedAt: now
      })
      .where(and(...conditions))
      .returning();

    const updatedCount = result.length;

    return {
      success: true,
      updatedCount,
      readAt: now
    };
  })
});
