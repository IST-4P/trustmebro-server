import { CategorySchema } from '@common/schemas/product';
import z from 'zod';
import { PaginationQueryResponseSchema } from '../../common/pagination.model';

export const GetManyCategoriesResponseSchema =
  PaginationQueryResponseSchema.extend({
    categories: z.array(CategorySchema),
  });

export const GetCategoryResponseSchema = CategorySchema;

export type GetManyCategoriesResponse = z.infer<
  typeof GetManyCategoriesResponseSchema
>;
export type GetCategoryResponse = z.infer<typeof GetCategoryResponseSchema>;
