import { CategoryAttributeSchema } from '@common/schemas/product';
import z from 'zod';

export const GetManyCategoryAttributesRequestSchema = z
  .object({
    categoryId: z.uuid(),
    attributeId: z.uuid(),
    isRequired: z.boolean(),
  })
  .partial();

export const GetCategoryAttributeRequestSchema = CategoryAttributeSchema.pick({
  id: true,
});

export const CreateCategoryAttributeRequestSchema =
  CategoryAttributeSchema.pick({
    categoryId: true,
    attributeId: true,
    isRequired: true,
  });

export const UpdateCategoryAttributeRequestSchema =
  CategoryAttributeSchema.pick({
    id: true,
    isRequired: true,
  });

export const DeleteCategoryAttributeRequestSchema =
  CategoryAttributeSchema.pick({
    id: true,
  });

export type GetManyCategoryAttributesRequest = z.infer<
  typeof GetManyCategoryAttributesRequestSchema
>;
export type GetCategoryAttributeRequest = z.infer<
  typeof GetCategoryAttributeRequestSchema
>;
export type CreateCategoryAttributeRequest = z.infer<
  typeof CreateCategoryAttributeRequestSchema
>;
export type UpdateCategoryAttributeRequest = z.infer<
  typeof UpdateCategoryAttributeRequestSchema
>;
export type DeleteCategoryAttributeRequest = z.infer<
  typeof DeleteCategoryAttributeRequestSchema
>;
