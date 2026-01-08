import { ShopSchema } from '@common/schemas/user-access';
import z from 'zod';

export const ShopResponseSchema = ShopSchema;

export const ValidateShopsResponseSchema = z.object({
  shops: z.array(
    ShopSchema.pick({
      id: true,
      name: true,
    })
  ),
});

export type ShopResponse = z.infer<typeof ShopResponseSchema>;
export type ValidateShopsResponse = z.infer<typeof ValidateShopsResponseSchema>;
