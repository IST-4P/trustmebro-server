import { ProductSchema } from '@common/schemas/product';
import z from 'zod';
import { PaginationQueryResponseSchema } from '../../common/pagination.model';

export const GetManyProductsResponseSchema =
  PaginationQueryResponseSchema.extend({
    products: z.array(
      ProductSchema.pick({
        name: true,
        basePrice: true,
        virtualPrice: true,
        images: true,
        status: true,
        averageRate: true,
        soldCount: true,
      })
    ),
  });

export const GetProductResponseSchema = ProductSchema;

export type GetManyProductsResponse = z.infer<
  typeof GetManyProductsResponseSchema
>;
export type GetProductResponse = z.infer<typeof GetProductResponseSchema>;
