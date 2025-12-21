import {
  BrandSchema,
  CategorySchema,
  ProductSchema,
  ShipsFromSchema,
  SKUSchema,
} from '@common/schemas/product';
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

export const ProductResponseSchema = ProductSchema.extend({
  skus: z.array(
    SKUSchema.pick({
      id: true,
      value: true,
      price: true,
      stock: true,
      image: true,
    })
  ),
  brand: BrandSchema.pick({
    id: true,
    name: true,
    logo: true,
  }),
  categories: z.array(
    CategorySchema.pick({
      id: true,
      name: true,
      logo: true,
      parentCategoryId: true,
    })
  ),
  shipsFrom: ShipsFromSchema.pick({
    id: true,
    address: true,
  }),
});

export type GetManyProductsResponse = z.infer<
  typeof GetManyProductsResponseSchema
>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
