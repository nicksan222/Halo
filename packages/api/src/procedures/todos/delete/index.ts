import { todos } from '@acme/db/src/schema/todos';
import { and, eq } from 'drizzle-orm';
import { protectedProcedure } from '../../../middlewares/protected';
import { router } from '../../../trpc';
import { deleteTodoInput } from './input';

export const todoDeleteRouter = router({
  todo: protectedProcedure.input(deleteTodoInput).mutation(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const [deleted] = await db
      .delete(todos)
      .where(and(eq(todos.id, input.id), eq(todos.userId, session!.user.id)))
      .returning();
    return deleted ?? null;
  })
});
