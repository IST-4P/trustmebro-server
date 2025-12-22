import { OrderItemSchema } from '@common/schemas/order';
import z from 'zod';

export const OrderItemResponseSchema = OrderItemSchema;

export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>;
