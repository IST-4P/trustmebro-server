import { AttributeSchema, CategorySchema } from '@common/schemas/product';
import z from 'zod';

export const AttributeResponseSchema = AttributeSchema.extend({
  categories: z.array(
    z.object({
      category: CategorySchema.pick({
        id: true,
        name: true,
        logo: true,
        parentCategoryId: true,
      }),
      isRequired: z.boolean(),
    })
  ),
});

export const GetAttributeResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  categoryIds: z.array(z.uuid()),
  categories: z.any(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetManyAttributesResponseSchema = z.object({
  attributes: z.array(GetAttributeResponseSchema),
});

export type GetManyAttributesResponse = z.infer<
  typeof GetManyAttributesResponseSchema
>;
export type AttributeResponse = z.infer<typeof AttributeResponseSchema>;
export type GetAttributeResponse = z.infer<typeof GetAttributeResponseSchema>;
