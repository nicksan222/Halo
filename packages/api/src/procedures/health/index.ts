import { publicProcedure } from '../../middlewares/public';
import { router } from '../../trpc';
import { healthInput } from './input';

export const healthRouter = router({
  ping: publicProcedure.input(healthInput).query(async (opts) => {
    const { input } = opts;
    return { status: 'ok', echo: input.ping ?? null };
  })
});
