import { z } from 'zod';

// Pagination input (shared across list operations)
const paginationInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
});

export const listNotificationsInput = z
  .object({
    isRead: z.boolean().optional(),
    type: z.string().optional(),
    severity: z.string().optional(),
    userId: z.string().optional()
  })
  .merge(paginationInput);

export type ListNotificationsInput = z.infer<typeof listNotificationsInput>;
