import { z } from 'zod';
import { BaseSchema } from '../common/base.schema';

export const AttributeSchema = BaseSchema.extend({
  key: z.uuid(),
});

export type Attribute = z.infer<typeof AttributeSchema>;
