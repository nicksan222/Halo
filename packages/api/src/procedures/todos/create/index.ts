import { randomUUID } from 'node:crypto';
import { todos } from '@acme/db/src/schema/todos';
import { protectedProcedure } from '../../../middlewares/protected';
import { router } from '../../../trpc';
import { emitNotification } from '../../notifications/send';
import { createTodoInput } from './input';

export const todoCreateRouter = router({
  todo: protectedProcedure.input(createTodoInput).mutation(async ({ ctx, input }) => {
    const { db, session, auth, headers } = ctx;

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

    if (session!.session.activeOrganizationId) {
      // Errors are fine, we just don't want to block the todo creation
      const membersResponse = await auth.api.listMembers({
        query: {
          organizationId: session!.session.activeOrganizationId,
          limit: 100,
          offset: 0
        },
        headers: headers
      });

      // Sending notification to all users of the organization
      for (const member of membersResponse.members || []) {
        await emitNotification({
          userId: member.userId,
          title: 'New todo created',
          body: `New todo created: ${input.title}`,
          navigateTo: `/todos/${todo.id}`,
          metadata: {
            todoId: todo.id
          }
        });
      }
    }

    return todo;
  })
});
