import { ShopSchema } from '@common/schemas/user-access';
import z from 'zod';

export const ShopResponseSchema = ShopSchema;

export type ShopResponse = z.infer<typeof ShopResponseSchema>;
