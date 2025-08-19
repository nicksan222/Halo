import { z } from 'zod';

export const getTodoInput = z.object({
  id: z.string().min(1, 'Todo ID is required')
});

export type GetTodoInput = z.infer<typeof getTodoInput>;
