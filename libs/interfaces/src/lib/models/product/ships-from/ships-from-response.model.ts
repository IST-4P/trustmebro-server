import { ShipsFromSchema } from '@common/schemas/product';
import z from 'zod';

export const ShipsFromResponseSchema = ShipsFromSchema;

export const GetShipsFromResponseSchema = ShipsFromSchema.pick({
  id: true,
  address: true,
  createdAt: true,
  updatedAt: true,
});
export const GetManyShipsFromResponseSchema = z.object({
  shipsFromList: z.array(GetShipsFromResponseSchema),
});

export type ShipsFromResponse = z.infer<typeof ShipsFromResponseSchema>;
export type GetShipsFromResponse = z.infer<typeof GetShipsFromResponseSchema>;
export type GetManyShipsFromResponse = z.infer<
  typeof GetManyShipsFromResponseSchema
>;
