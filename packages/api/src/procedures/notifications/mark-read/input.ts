import { z } from 'zod';

export const markNotificationsReadInput = z.object({
  // Mark all notifications up to and including this ID as read
  // If not provided, marks all unread notifications as read
  latestReadId: z.string().optional(),
  // Optional: only mark notifications of specific types as read
  type: z.string().optional(),
  // Optional: only mark notifications of specific severity as read
  severity: z.string().optional()
});

export type MarkNotificationsReadInput = z.infer<typeof markNotificationsReadInput>;
