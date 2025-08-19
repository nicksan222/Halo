import { z } from 'zod';

export const deleteTodoInput = z.object({
  id: z.string().min(1, 'Todo ID is required')
});

export type DeleteTodoInput = z.infer<typeof deleteTodoInput>;
