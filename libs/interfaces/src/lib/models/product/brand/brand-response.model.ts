import { BrandSchema } from '@common/schemas/product';
import z from 'zod';
import { PaginationQueryResponseSchema } from '../../common/pagination.model';

export const GetManyBrandsResponseSchema = PaginationQueryResponseSchema.extend(
  {
    brands: z.array(BrandSchema),
  }
);

export const GetBrandResponseSchema = BrandSchema;

export type GetManyBrandsResponse = z.infer<typeof GetManyBrandsResponseSchema>;
export type GetBrandResponse = z.infer<typeof GetBrandResponseSchema>;
