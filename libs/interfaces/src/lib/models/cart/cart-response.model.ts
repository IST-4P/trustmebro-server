import { CartItemSchema } from '@common/schemas/cart';
import z from 'zod';
import { PaginationQueryResponseSchema } from '../common/pagination.model';

export const CartItemResponseSchema = CartItemSchema;

export const AddCartResponseSchema = z.object({
  cartItem: CartItemResponseSchema,
  cartCount: z.number().int(),
});

export const GetManyCartItemsResponseSchema =
  PaginationQueryResponseSchema.extend({
    cartItems: z.array(
      z.object({
        shopId: z.uuid(),
        cartItems: z.array(CartItemResponseSchema),
      })
    ),
  });

export const DeleteCartResponseSchema = z.object({
  cartCount: z.number().int(),
});

export type CartItemResponse = z.infer<typeof CartItemResponseSchema>;
export type AddCartResponse = z.infer<typeof AddCartResponseSchema>;
export type DeleteCartResponse = z.infer<typeof DeleteCartResponseSchema>;
export type GetManyCartItemsResponse = z.infer<
  typeof GetManyCartItemsResponseSchema
>;
