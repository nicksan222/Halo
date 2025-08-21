import { randomUUID } from 'node:crypto';
import { db, notificationsSchema } from '@acme/db';
import type { NotificationEvent } from '../subscribe';
import { notificationsEvents } from '../subscribe';

/**
 * Emit a notification event to subscribers.
 * Also persists the notification to the database.
 * Returns the event id used.
 *
 * @example
 * const id = await emitNotification({
 *  userId: 'user_123',
 *  title: 'New message',
 *  body: 'You have a new message',
 *  navigateTo: '/inbox/42',
 *  metadata: { foo: 'bar' },
 *  type: 'message',
 *  severity: 'info',
 * });
 */
export async function emitNotification(
  event: Omit<NotificationEvent, 'id'> & { id?: string }
): Promise<string> {
  const id = event.id ?? randomUUID();

  await db.insert(notificationsSchema.notifications).values({
    id,
    userId: event.userId,
    title: event.title ?? '',
    body: event.body,
    type: event.type,
    severity: event.severity,
    navigateTo: event.navigateTo ?? null,
    metadata: event.metadata ? JSON.stringify(event.metadata) : null
  });

  notificationsEvents.emit('notification', { id, ...event } satisfies NotificationEvent);
  return id;
}
