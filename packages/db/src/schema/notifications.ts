import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { users } from './auth';

export const notifications = pgTable(
  'notifications',
  {
    id: text('id').primaryKey(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    title: text('title').notNull(),
    body: text('body'),
    type: text('type'),
    severity: text('severity'),
    navigateTo: text('navigate_to'),
    metadata: text('metadata'),
    isRead: boolean('is_read')
      .$defaultFn(() => false)
      .notNull(),
    readAt: timestamp('read_at'),
    createdAt: timestamp('created_at')
      .$defaultFn(() => new Date())
      .notNull(),
    updatedAt: timestamp('updated_at')
      .$defaultFn(() => new Date())
      .notNull()
  },
  (table) => ({
    userIdx: index('notifications_user_idx').on(table.userId),
    isReadIdx: index('notifications_is_read_idx').on(table.isRead),
    readAtIdx: index('notifications_read_at_idx').on(table.readAt),
    readCleanupIdx: index('notifications_read_cleanup_idx').on(table.isRead, table.readAt),
    createdAtIdx: index('notifications_created_at_idx').on(table.createdAt)
  })
);
