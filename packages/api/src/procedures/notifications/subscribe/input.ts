import { z } from 'zod';

export const subscribeInput = z
  .object({
    userId: z.string().optional(),
    lastEventId: z.string().nullish()
  })
  .optional();
