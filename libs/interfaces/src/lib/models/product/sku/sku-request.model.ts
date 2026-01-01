import { SKUSchema } from '@common/schemas/product';
import z from 'zod';

export const GetSKURequestSchema = SKUSchema.pick({
  id: true,
})
  .extend({
    processId: z.uuid().optional(),
  })
  .strict();

export type GetSKURequest = z.infer<typeof GetSKURequestSchema>;
