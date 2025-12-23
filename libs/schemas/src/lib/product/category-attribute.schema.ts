import { z } from 'zod';

export const CategoryAttributeSchema = z.object({
  id: z.uuid(),
  categoryId: z.uuid(),
  attributeId: z.uuid(),
  isRequired: z.boolean().default(false),
});

export type CategoryAttribute = z.infer<typeof CategoryAttributeSchema>;
