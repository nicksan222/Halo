import { ac } from '../permissions';

export const admin = ac.newRole({
  todos: ['list', 'create', 'update', 'delete']
});
