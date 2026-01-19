import { ReviewResponse } from '@common/interfaces/models/review';
import { Prisma } from '@prisma-client/query';

export const ReviewMapper = (
  data: ReviewResponse & { shopName?: string }
): Prisma.ReviewViewCreateInput => {
  return {
    id: data.ReviewId,
    userId: data.UserId,
    productId: data.ProductId,
    sellerId: data.SellerId,
    orderId: data.OrderId,
    orderItemId: data.OrderItemId,
    targetType: 'PRODUCT',

    rating: data.Rating,
    content: data.Content,
    medias: data.Medias,

    createdAt: data.CreatedAt,
  };
};
