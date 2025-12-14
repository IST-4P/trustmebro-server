import { AttributeSchema } from '@common/schemas/product';
import z from 'zod';

export const GetManyAttributesRequestSchema = z
  .object({
    key: z.string(),
    category: z.string(),
  })
  .partial();

export const GetAttributeRequestSchema = AttributeSchema.pick({
  id: true,
});

export const CreateAttributeRequestSchema = AttributeSchema.pick({
  key: true,
  createdById: true,
});

export const UpdateAttributeRequestSchema = AttributeSchema.pick({
  id: true,
  key: true,
  updatedById: true,
});

export const DeleteAttributeRequestSchema = AttributeSchema.pick({
  id: true,
  deletedById: true,
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
