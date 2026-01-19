import z from 'zod';
import { PaginationQueryRequestSchema } from '../common/pagination.model';

export const GetManyProductReviewsRequestSchema =
  PaginationQueryRequestSchema.extend({
    productId: z.uuid(),
    rating: z.coerce.number().min(1).max(5).default(1),
  })
    .extend({
      processId: z.uuid().optional(),
    })
    .strict();

export const CreateProductReviewRequestSchema = z
  .object({
    orderItemId: z.uuid(),
    orderId: z.uuid(),
    rating: z.number().min(1).max(5),
    content: z.string().max(500),
    medias: z.array(z.string()),
    userId: z.uuid(),
    processId: z.uuid().optional(),
  })
  .strict();

export type GetManyProductReviewsRequest = z.infer<
  typeof GetManyProductReviewsRequestSchema
>;
export type CreateProductReviewRequest = z.infer<
  typeof CreateProductReviewRequestSchema
>;
