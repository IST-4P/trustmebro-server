import { z } from 'zod';
import { BaseSchema } from '../common/base.schema';

export const SkuSchema = BaseSchema.extend({
  value: z.string(),
  price: z.number(),
  stock: z.number(),
  image: z.string().optional(),
  productId: z.string(),
});

export type Sku = z.infer<typeof SkuSchema>;
