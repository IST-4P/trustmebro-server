import z from 'zod';
import { PaginationQueryResponseSchema } from '../common/pagination.model';

export const ReviewResponseSchema = z.object({
  ReviewId: z.uuid(),
  ProductId: z.uuid(),
  UserId: z.uuid(),
  SellerId: z.uuid(),
  OrderId: z.uuid(),
  OrderItemId: z.uuid(),
  Rating: z.number().min(1).max(5),
  Content: z.string(),
  Medias: z.array(z.string()),
  CreatedAt: z.any(),
});

export const GetManyProductReviewsResponseSchema =
  PaginationQueryResponseSchema.extend({
    reviews: z.array(
      z.object({
        rating: z.number(),
        id: z.uuid(),
        userId: z.uuid(),
        content: z.string(),
        medias: z.array(z.string()),
        reply: z.object({
          id: z.uuid(),
          sellerId: z.uuid(),
          content: z.string(),
        }),
      })
    ),
    rating: z.object({
      productId: z.uuid(),
      averageRating: z.number(),
      totalReviews: z.number(),
      oneStarCount: z.number(),
      twoStarCount: z.number(),
      threeStarCount: z.number(),
      fourStarCount: z.number(),
      fiveStarCount: z.number(),
    }),
  });

export type ReviewResponse = z.infer<typeof ReviewResponseSchema>;
export type GetManyProductReviewsResponse = z.infer<
  typeof GetManyProductReviewsResponseSchema
>;
