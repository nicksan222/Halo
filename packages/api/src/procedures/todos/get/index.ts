import { todos } from '@acme/db/src/schema/todos';
import { TRPCError } from '@trpc/server';
import { and, eq } from 'drizzle-orm';
import { protectedProcedure } from '../../../middlewares/protected';
import { router } from '../../../trpc';
import { getTodoInput } from './input';

export const todoGetRouter = router({
  byId: protectedProcedure.input(getTodoInput).query(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const rows = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, input.id), eq(todos.userId, session!.user.id)))
      .limit(1);
    const todo = rows[0];

    if (!todo) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Todo not found' });
    }

    return todo;
  })
});
