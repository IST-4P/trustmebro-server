import { PaymentSchema } from '@common/schemas/payment';
import z from 'zod';

// export const GetManyPaymentsRequestSchema = PaginationQueryRequestSchema.extend({
//   name: PaymentSchema.shape.name.optional(),
// });

// export const GetPaymentRequestSchema = PaymentSchema.pick({
//   id: true,
// });

export const CreatePaymentRequestSchema = PaymentSchema.pick({
  id: true,
  code: true,
  userId: true,
  orderId: true,
  method: true,
  status: true,
  amount: true,
})
  .extend({
    processId: z.uuid().optional(),
  })
  .strict();

export const DeletePaymentRequestSchema = PaymentSchema.pick({
  id: true,
  deletedById: true,
})
  .extend({
    processId: z.uuid().optional(),
  })
  .strict();

export type CreatePaymentRequest = z.infer<typeof CreatePaymentRequestSchema>;
export type DeletePaymentRequest = z.infer<typeof DeletePaymentRequestSchema>;
