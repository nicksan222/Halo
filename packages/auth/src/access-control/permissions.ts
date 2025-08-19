import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements } from 'better-auth/plugins/admin/access';

export const statements = {
  ...defaultStatements,
  todos: ['list', 'create', 'update', 'delete']
} as const;

export const ac = createAccessControl(statements);
