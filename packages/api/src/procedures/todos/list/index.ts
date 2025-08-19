import { todos } from '@acme/db/src/schema/todos';
import { and, eq } from 'drizzle-orm';
import { protectedProcedure } from '../../../middlewares/protected';
import { router } from '../../../trpc';
import { listTodosInput } from './input';

export const todoListRouter = router({
  all: protectedProcedure.input(listTodosInput).query(async ({ ctx, input }) => {
    const { db, session } = ctx;

    const page = input.page ?? 1;
    const limit = input.limit ?? 20;
    const offset = (page - 1) * limit;

    const conditions = [eq(todos.userId, input.userId ?? session.user.id)];
    if (typeof input.completed === 'boolean') {
      conditions.push(eq(todos.completed, input.completed));
    }

    const rows = await db
      .select()
      .from(todos)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    return rows;
  })
});
