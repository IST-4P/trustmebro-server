import { z } from 'zod';
import { BaseSchema } from '../common/base.schema';

export const ProductAddressSchema = BaseSchema.extend({
  address: z.string(),
});
