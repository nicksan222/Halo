import { z } from 'zod';

export const subscribeOutput = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string().optional(),
  body: z.string().optional(),
  navigateTo: z.string().nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional(),
  severity: z.string().nullable().optional(),
  type: z.string().nullable().optional()
});

export type SubscribeOutput = z.infer<typeof subscribeOutput>;
