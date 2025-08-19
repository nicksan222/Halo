import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const todos = pgTable(
  'todos',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    description: text('description'),
    completed: boolean('completed')
      .$defaultFn(() => false)
      .notNull(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at')
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => new Date())
      .notNull()
  },
  (table) => ({
    userIdx: index('todos_user_idx').on(table.userId),
    completedIdx: index('todos_completed_idx').on(table.completed)
  })
);
