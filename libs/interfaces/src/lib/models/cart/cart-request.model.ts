import { CartItemSchema } from '@common/schemas/cart';
import z from 'zod';
import { PaginationQueryRequestSchema } from '../common/pagination.model';

export const GetManyCartItemsRequestSchema =
  PaginationQueryRequestSchema.extend({
    userId: z.uuid(),
  }).extend({
    processId: z.uuid().optional(),
  });

export const GetUniqueCartItemRequestSchema = CartItemSchema.pick({
  cartId: true,
  productId: true,
  skuId: true,
}).extend({
  processId: z.uuid().optional(),
});

export const AddCartItemRequestSchema = CartItemSchema.pick({
  productId: true,
  skuId: true,
  shopId: true,
  quantity: true,
  skuValue: true,
  productName: true,
  productImage: true,
}).extend({
  userId: z.uuid(),
  processId: z.uuid().optional(),
});

export type GetUniqueCartItemRequest = z.infer<
  typeof GetUniqueCartItemRequestSchema
>;
export type AddCartItemRequest = z.infer<typeof AddCartItemRequestSchema>;
export type GetManyCartItemsRequest = z.infer<
  typeof GetManyCartItemsRequestSchema
>;
