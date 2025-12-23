import { CategorySchema } from '@common/schemas/product';
import z from 'zod';
import { PaginationQueryResponseSchema } from '../../common/pagination.model';

export const CategoryResponseSchema = CategorySchema.extend({
  parentCategory: z
    .object({
      id: z.uuid(),
      name: z.string(),
    })
    .nullable(),
});

export const GetCategoryResponseSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  logo: z.url(),
  parentId: z.uuid().optional(),
  path: z.string(),
  level: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetManyCategoriesResponseSchema =
  PaginationQueryResponseSchema.extend({
    categories: z.array(GetCategoryResponseSchema),
  });

export type GetManyCategoriesResponse = z.infer<
  typeof GetManyCategoriesResponseSchema
>;
export type CategoryResponse = z.infer<typeof CategoryResponseSchema>;
export type GetCategoryResponse = z.infer<typeof GetCategoryResponseSchema>;
