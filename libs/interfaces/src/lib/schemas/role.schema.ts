import z from 'zod';
import { BaseSchema } from './base.schema';

export const RoleSchema = BaseSchema.extend({
  name: z.string().max(500),
  description: z.string(),
  userIds: z.array(z.uuid()),
});
