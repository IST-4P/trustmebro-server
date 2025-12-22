import { PaymentMethodEnums } from '@common/constants/order.constant';
import { ReceiverSchema } from '@common/schemas/order';
import z from 'zod';
import { ValidateItemResultSchema } from '../product';

export const CreateOrderRequestSchema = z.object({
  processId: z.uuid().optional(),
  shippingFee: z.number(),
  paymentMethod: PaymentMethodEnums,
  userId: z.string(),
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
  paymentMethod: PaymentMethodEnums,
  receiver: ReceiverSchema,
  orders: z.array(
    z.object({
      shopId: z.uuid(),
      items: z.array(ValidateItemResultSchema),
    })
  ),
});

export type CreateOrderRequest = z.infer<typeof CreateOrderRequestSchema>;
export type CreateOrderRepository = z.infer<typeof CreateOrderRepositorySchema>;
