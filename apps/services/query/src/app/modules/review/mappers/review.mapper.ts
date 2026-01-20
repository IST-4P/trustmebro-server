import {
  CreateReviewResponse,
  UpdateReviewResponse,
} from '@common/interfaces/models/review';
import { Prisma } from '@prisma-client/query';

export const CreateReviewMapper = (
  data: CreateReviewResponse
): Prisma.ReviewViewCreateInput => {
  return {
    id: data.ReviewId,
    userId: data.UserId,
    productId: data.ProductId,
    shopId: data.SellerId,
    orderId: data.OrderId,
    orderItemId: data.OrderItemId,
    targetType: 'PRODUCT',

    rating: data.Rating,
    content: data.Content,
    medias: data.Medias,

    createdAt: data.CreatedAt,
    updatedAt: data?.UpdatedAt,
  };
};

export const UpdateReviewMapper = (
  data: UpdateReviewResponse
): Prisma.ReviewViewUpdateInput => {
  return {
    id: data.ReviewId,
    userId: data.UserId,
    productId: data.ProductId,
    rating: data.Rating,
    content: data.Content,
    medias: data.Medias,
    updatedAt: data.UpdatedAt,
  };
};
