import { ShipsFromSchema } from '@common/schemas/product';
import z from 'zod';

export const GetManyShipsFromRequestSchema = ShipsFromSchema.pick({
  address: true,
})
  .partial()
  .extend({
    processId: z.uuid().optional(),
  });

export const GetShipsFromRequestSchema = ShipsFromSchema.pick({
  id: true,
}).extend({
  processId: z.uuid().optional(),
});

export const CreateShipsFromRequestSchema = ShipsFromSchema.pick({
  address: true,
})
  .extend({
    processId: z.uuid().optional(),
  })
  .strict();

export const UpdateShipsFromRequestSchema = ShipsFromSchema.pick({
  id: true,
  address: true,
})
  .extend({
    processId: z.uuid().optional(),
  })
  .strict();

export const DeleteShipsFromRequestSchema = ShipsFromSchema.pick({
  id: true,
  deletedById: true,
})
  .extend({
    processId: z.uuid().optional(),
  })
  .strict();

export type GetManyShipsFromRequest = z.infer<
  typeof GetManyShipsFromRequestSchema
>;
export type GetShipsFromRequest = z.infer<typeof GetShipsFromRequestSchema>;
export type CreateShipsFromRequest = z.infer<
  typeof CreateShipsFromRequestSchema
>;
export type UpdateShipsFromRequest = z.infer<
  typeof UpdateShipsFromRequestSchema
>;
export type DeleteShipsFromRequest = z.infer<
  typeof DeleteShipsFromRequestSchema
>;
