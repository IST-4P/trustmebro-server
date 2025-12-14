import { CategoryAttributeSchema } from '@common/schemas/product';
import z from 'zod';

export const GetManyCategoryAttributesResponseSchema = z.object({
  categoryAttributes: z.array(CategoryAttributeSchema),
});

export const GetCategoryAttributeResponseSchema = CategoryAttributeSchema;

export type GetManyCategoryAttributesResponse = z.infer<
  typeof GetManyCategoryAttributesResponseSchema
>;
export type GetCategoryAttributeResponse = z.infer<
  typeof GetCategoryAttributeResponseSchema
>;
