import EventEmitter, { on } from 'node:events';
import { z } from 'zod';
import { publicProcedure } from '../../../middlewares/public';
import { router } from '../../../trpc';
import { subscribeInput } from './input';

export const notificationEventSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().optional(),
  body: z.string().optional(),
  navigateTo: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  severity: z.string().nullable().optional(),
  type: z.string().nullable().optional()
});
export type NotificationEvent = z.infer<typeof notificationEventSchema>;

export const notificationsEvents = new EventEmitter();

export const subscriptionsRouter = router({
  onNotification: publicProcedure
    .input(subscribeInput)
    .subscription(async function* (opts): AsyncGenerator<NotificationEvent, void, unknown> {
      const { signal } = opts;

      if (opts.input?.lastEventId) {
        // No backlog replay implemented here — live only.
      }

      const events = on(notificationsEvents, 'notification', { signal }) as AsyncIterableIterator<
        [NotificationEvent]
      >;

      for await (const [payload] of events) {
        if (opts.input?.userId && payload.userId !== opts.input.userId) continue;
        yield payload;
      }
    })
});
