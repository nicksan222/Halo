import { todos } from '@acme/db/src/schema/todos';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { protectedProcedure } from '../../../middlewares/protected';
import { router } from '../../../trpc';
import { updateTodoInput } from './input';

export const todoUpdateRouter = router({
  todo: protectedProcedure.input(updateTodoInput).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const [existing] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, input.id), eq(todos.userId, session!.user.id)))
      .limit(1);
    if (!existing) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Todo not found' });
    }

    const [updated] = await db
      .update(todos)
      .set({
        title: input.title ?? existing.title,
        description: input.description ?? existing.description,
        completed: typeof input.completed === 'boolean' ? input.completed : existing.completed,
        updatedAt: new Date()
      })
      .where(and(eq(todos.id, input.id), eq(todos.userId, session!.user.id)))
      .returning();

    return updated;
  })
});
