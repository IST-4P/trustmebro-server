import { AttributeSchema } from '@common/schemas/product';
import z from 'zod';

export const GetManyAttributesRequestSchema = z
  .object({
    name: z.string(),
    categoryId: z.string(),
  })
  .partial();

export const GetAttributeRequestSchema = AttributeSchema.pick({
  id: true,
});

export const CreateAttributeRequestSchema = AttributeSchema.pick({
  name: true,
  createdById: true,
}).extend({
  categoryId: z.uuid().optional(),
  isRequired: z.boolean().optional(),
  processId: z.string().optional(),
});

export const UpdateAttributeRequestSchema = AttributeSchema.pick({
  id: true,
  name: true,
  updatedById: true,
}).extend({
  processId: z.string().optional(),
});

export const DeleteAttributeRequestSchema = AttributeSchema.pick({
  id: true,
  deletedById: true,
}).extend({
  processId: z.string().optional(),
});

export type GetManyAttributesRequest = z.infer<
  typeof GetManyAttributesRequestSchema
>;
export type GetAttributeRequest = z.infer<typeof GetAttributeRequestSchema>;
export type CreateAttributeRequest = z.infer<
  typeof CreateAttributeRequestSchema
>;
export type UpdateAttributeRequest = z.infer<
  typeof UpdateAttributeRequestSchema
>;
export type DeleteAttributeRequest = z.infer<
  typeof DeleteAttributeRequestSchema
>;
