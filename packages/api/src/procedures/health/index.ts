import { baseProcedure } from '../../middlewares/public';
import { router } from '../../trpc';
import { healthInput } from './input';

export const healthRouter = router({
  ping: baseProcedure.input(healthInput).query(async (opts: any) => {
    const { input } = opts;
    return { status: 'ok', echo: input.ping ?? null };
  })
});
