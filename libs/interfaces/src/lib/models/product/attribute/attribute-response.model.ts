import { AttributeSchema } from '@common/schemas/product';
import z from 'zod';

export const GetManyAttributesResponseSchema = z.object({
  attributes: z.array(AttributeSchema),
});

export const GetAttributeResponseSchema = AttributeSchema;

export type GetManyAttributesResponse = z.infer<
  typeof GetManyAttributesResponseSchema
>;
export type GetAttributeResponse = z.infer<typeof GetAttributeResponseSchema>;
