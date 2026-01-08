import { PaymentMethodEnums } from '@common/constants/payment.constant';
import { OrderSchema, ReceiverSchema } from '@common/schemas/order';
import z from 'zod';
import { PaginationQueryRequestSchema } from '../common/pagination.model';
import { ValidateItemResultSchema } from '../product';

export const CreateOrderRequestSchema = z.object({
  processId: z.uuid().optional(),
  shippingFee: z.number(),
  discount: z.number(),
  paymentMethod: PaymentMethodEnums,
  userId: z.uuid(),
  receiver: ReceiverSchema,
  orders: z.array(
    z.object({
      shopId: z.uuid(),
      cartItemIds: z.array(z.uuid()).min(1),
    })
  ),
});

export const CreateOrderRepositorySchema = z.object({
  userId: z.uuid(),
  shippingFee: z.number(),
  discount: z.number(),
  paymentMethod: PaymentMethodEnums,
  receiver: ReceiverSchema,
  paymentId: z.uuid(),
  orders: z.array(
    z.object({
      shopId: z.uuid(),
      items: z.array(ValidateItemResultSchema),
    })
  ),
});

export const CancelOrderRequestSchema = z.object({
  orderId: z.uuid(),
  userId: z.uuid(),
  processId: z.uuid().optional(),
});

export const GetManyOrdersRequestSchema = PaginationQueryRequestSchema.extend({
  paymentId: z.uuid().optional(),
  status: OrderSchema.shape.status.optional(),
  userId: z.uuid().optional(),
});

export const GetOrderRequestSchema = z.object({
  orderId: z.uuid(),
  userId: z.uuid().optional(),
});

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type CreateOrderRepository = z.infer<typeof CreateOrderRepositorySchema>;
export type CancelOrderRequest = z.infer<typeof CancelOrderRequestSchema>;
export type GetManyOrdersRequest = z.infer<typeof GetManyOrdersRequestSchema>;
export type GetOrderRequest = z.infer<typeof GetOrderRequestSchema>;
