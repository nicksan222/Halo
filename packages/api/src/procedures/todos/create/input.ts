import { z } from 'zod';

export const createTodoInput = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
});

export type CreateTodoInput = z.infer<typeof createTodoInput>;
