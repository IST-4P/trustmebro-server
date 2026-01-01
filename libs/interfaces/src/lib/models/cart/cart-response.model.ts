import { CartItemSchema } from '@common/schemas/cart';
import z from 'zod';

export const CartItemResponseSchema = CartItemSchema;

export const AddCartResponseSchema = z.object({
  cartItem: CartItemResponseSchema,
  cartCount: z.number().int(),
});

export const DeleteCartResponseSchema = z.object({
  cartCount: z.number().int(),
});

export type CartItemResponse = z.infer<typeof CartItemResponseSchema>;
export type AddCartResponse = z.infer<typeof AddCartResponseSchema>;
export type DeleteCartResponse = z.infer<typeof DeleteCartResponseSchema>;
