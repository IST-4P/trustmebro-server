import { PaymentSchema } from '@common/schemas/payment';
import z from 'zod';

export const PaymentResponseSchema = PaymentSchema;

export type PaymentResponse = z.infer<typeof PaymentResponseSchema>;
