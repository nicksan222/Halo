import EventEmitter, { on } from 'node:events';
import { tracked } from '@trpc/server';
import { z } from 'zod';
import { publicProcedure } from '../../middlewares/public';
import { router } from '../../trpc';

export type NotificationEvent = {
  id: string;
  userId: string;
  title?: string;
  body?: string;
  navigateTo?: string | null;
  metadata?: Record<string, unknown> | null;
  severity?: string | null;
  type?: string | null;
};

export const notificationsEvents = new EventEmitter();

export const subscriptionsRouter = router({
  onNotification: publicProcedure
    .input(
      z
        .object({
          userId: z.string().optional(),
          lastEventId: z.string().nullish()
        })
        .optional()
    )
    .subscription(async function* (opts) {
      const { signal } = opts;

      if (opts.input?.lastEventId) {
        // No backlog replay implemented here — live only.
      }

      for await (const [event] of on(notificationsEvents, 'notification', { signal })) {
        const payload = event as NotificationEvent;
        if (opts.input?.userId && payload.userId !== opts.input.userId) continue;
        yield tracked(payload.id, payload);
      }
    })
});
