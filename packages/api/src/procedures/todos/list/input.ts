import { z } from 'zod';

// Pagination input (shared across list operations)
const paginationInput = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20)
});

export const listTodosInput = z
  .object({
    completed: z.boolean().optional(),
    userId: z.string().optional()
  })
  .merge(paginationInput);

export type ListTodosInput = z.infer<typeof listTodosInput>;
