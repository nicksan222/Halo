import { notifications } from '@acme/db/src/schema/notifications';
import { and, eq, isNull, lte } from 'drizzle-orm';
import { protectedProcedure } from '../../../middlewares/protected';
import { router } from '../../../trpc';
import { markNotificationsReadInput } from './input';

export const markNotificationsReadRouter = router({
  batch: protectedProcedure.input(markNotificationsReadInput).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const now = new Date();
    const baseConditions = [
      eq(notifications.userId, session.user.id),
      isNull(notifications.readAt) // Only mark unread notifications
    ];

    // Optional type filter
    if (input.type) {
      baseConditions.push(eq(notifications.type, input.type));
    }

    // Optional severity filter
    if (input.severity) {
      baseConditions.push(eq(notifications.severity, input.severity));
    }

    const conditions = [...baseConditions];

    // If latestReadId is provided, mark all notifications up to and including that notification's createdAt
    if (input.latestReadId) {
      const targetRows = await db
        .select({ createdAt: notifications.createdAt })
        .from(notifications)
        .where(
          and(eq(notifications.userId, session.user.id), eq(notifications.id, input.latestReadId))
        )
        .limit(1);

      const target = targetRows[0];
      if (target?.createdAt) {
        conditions.push(lte(notifications.createdAt, target.createdAt));
      }
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
