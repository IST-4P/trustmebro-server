import { PaymentSchema } from '@common/schemas/payment';
import z from 'zod';
import { PaginationQueryResponseSchema } from '../../common/pagination.model';

export const PaymentResponseSchema = PaymentSchema;

export const GetManyPaymentsResponseSchema =
  PaginationQueryResponseSchema.extend({
    payments: z.array(PaymentSchema),
  });

export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;
export type GetManyPaymentsResponse = z.infer<
  typeof GetManyPaymentsResponseSchema
>;
