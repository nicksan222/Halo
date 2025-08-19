import { z } from 'zod';

export const healthInput = z.object({
  ping: z.string().optional()
});

export type HealthInput = z.infer<typeof healthInput>;
