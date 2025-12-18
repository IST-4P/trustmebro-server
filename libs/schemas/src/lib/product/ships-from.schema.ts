import { z } from 'zod';
import { BaseSchema } from '../common/base.schema';

export const ShipsFromSchema = BaseSchema.extend({
  address: z.string(),
});

export type ShipsFrom = z.infer<typeof ShipsFromSchema>;
