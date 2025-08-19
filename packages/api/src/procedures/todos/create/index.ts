import { randomUUID } from 'node:crypto';
import { todos } from '@acme/db/src/schema/todos';
import { protectedProcedure } from '../../../middlewares/protected';
import { router } from '../../../trpc';
import { createTodoInput } from './input';

export const todoCreateRouter = router({
  todo: protectedProcedure.input(createTodoInput).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const now = new Date();
    const [todo] = await db
      .insert(todos)
      .values({
        id: randomUUID(),
        title: input.title,
        description: input.description ?? null,
        completed: false,
        userId: session!.user.id,
        createdAt: now,
        updatedAt: now
      })
      .returning();

    return todo;
  })
});
