import { CreateReplyResponse } from '@common/interfaces/models/review';
import { Prisma } from '@prisma-client/query';

export const UpdateReplyMapper = (
  data: CreateReplyResponse
): Prisma.ReviewViewUpdateInput => {
  return {
    id: data.ReviewId as string,
    reply: {
      id: data.ReplyId,
      reviewId: data.ReviewId,
      shopId: data.SellerId,
      content: data.Content,
      createdAt: data.CreatedAt,
    },
  };
};
