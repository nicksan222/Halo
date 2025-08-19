import { z } from 'zod';

export const updateTodoInput = z.object({
  id: z.string().min(1, 'Todo ID is required'),
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  completed: z.boolean().optional()
});

export type UpdateTodoInput = z.infer<typeof updateTodoInput>;
