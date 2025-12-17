import { AttributeSchema } from '@common/schemas/product';
import z from 'zod';

export const AttributeResponseSchema = AttributeSchema;

export const GetAttributeResponseSchema = z.object({
  id: z.uuid(),
  key: z.string(),
  categoryIds: z.array(z.uuid()),
  categories: z.any(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GetManyAttributesResponseSchema = z.object({
  attributes: z.array(GetAttributeResponseSchema),
});

export type GetManyAttributesResponse = z.infer<
  typeof GetManyAttributesResponseSchema
>;
export type AttributeResponse = z.infer<typeof AttributeResponseSchema>;
export type GetAttributeResponse = z.infer<typeof GetAttributeResponseSchema>;
