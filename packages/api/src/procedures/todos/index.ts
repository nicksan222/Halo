import { router } from '../../trpc';
import { todoCreateRouter } from './create';
import { todoDeleteRouter } from './delete';
import { todoGetRouter } from './get';
import { todoListRouter } from './list';
import { todoUpdateRouter } from './update';

export const todosRouter = router({
  create: todoCreateRouter,
  get: todoGetRouter,
  list: todoListRouter,
  update: todoUpdateRouter,
  delete: todoDeleteRouter
});
