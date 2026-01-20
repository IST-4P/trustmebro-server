import { GetManyProductReviewsRequest } from '@common/interfaces/models/review';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ReviewRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyProductReviewsRequest) {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    let where: Prisma.ReviewViewWhereInput = {
      productId: data?.productId || undefined,
      userId: data?.userId || undefined,
      shopId: data?.shopId || undefined,
    };

    if (data.productId && data.rating) {
      where.rating = data.rating;
    }

    const [totalItems, reviews, rating] = await Promise.all([
      this.prismaService.reviewView.count({
        where,
      }),
      this.prismaService.reviewView.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          productId: true,
          userId: true,
          rating: true,
          content: true,
          medias: true,
          reply: true,
        },
      }),
      data.productId
        ? this.prismaService.productRatingView.findUnique({
            where: { productId: data.productId },
            omit: {
              updatedAt: true,
            },
          })
        : null,
    ]);
    return {
      reviews,
      rating,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  async create(data: Prisma.ReviewViewCreateInput) {
    return this.prismaService.$transaction(async (tx) => {
      const review = await tx.reviewView.create({
        data,
      });

      if (data.productId) {
        await this.updateProductRating(data.productId, tx);
      }

      if (data.shopId) {
        await this.updateShopRating(data.shopId, tx);
      }

      return review;
    });
  }

  private async updateProductRating(
    productId: string,
    tx?: Prisma.TransactionClient
  ) {
    const prisma = tx || this.prismaService;

    // Get all reviews for this product
    const reviews = await prisma.reviewView.findMany({
      where: { productId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return;
    }

    // Calculate stats
    const totalReviews = reviews.length;
    const sumRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRating / totalReviews;

    const oneStarCount = reviews.filter((r) => r.rating === 1).length;
    const twoStarCount = reviews.filter((r) => r.rating === 2).length;
    const threeStarCount = reviews.filter((r) => r.rating === 3).length;
    const fourStarCount = reviews.filter((r) => r.rating === 4).length;
    const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

    // Upsert ProductRatingView
    await prisma.productRatingView.upsert({
      where: { productId },
      create: {
        productId,
        averageRating,
        totalReviews,
        oneStarCount,
        twoStarCount,
        threeStarCount,
        fourStarCount,
        fiveStarCount,
      },
      update: {
        averageRating,
        totalReviews,
        oneStarCount,
        twoStarCount,
        threeStarCount,
        fourStarCount,
        fiveStarCount,
      },
    });
  }

  private async updateShopRating(
    shopId: string,
    tx?: Prisma.TransactionClient
  ) {
    const prisma = tx || this.prismaService;

    // Get all reviews for this shop
    const reviews = await prisma.reviewView.findMany({
      where: { shopId },
      select: { rating: true },
    });

    if (reviews.length === 0) {
      return;
    }

    // Calculate stats
    const totalReviews = reviews.length;
    const sumRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = sumRating / totalReviews;

    const oneStarCount = reviews.filter((r) => r.rating === 1).length;
    const twoStarCount = reviews.filter((r) => r.rating === 2).length;
    const threeStarCount = reviews.filter((r) => r.rating === 3).length;
    const fourStarCount = reviews.filter((r) => r.rating === 4).length;
    const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

    // Upsert ShopRatingView
    await prisma.shopRatingView.upsert({
      where: { shopId },
      create: {
        shopId,
        averageRating,
        totalReviews,
        oneStarCount,
        twoStarCount,
        threeStarCount,
        fourStarCount,
        fiveStarCount,
      },
      update: {
        averageRating,
        totalReviews,
        oneStarCount,
        twoStarCount,
        threeStarCount,
        fourStarCount,
        fiveStarCount,
      },
    });
  }

  async update(data: Prisma.ReviewViewUpdateInput) {
    return this.prismaService.$transaction(async (tx) => {
      const review = await tx.reviewView.update({
        where: { id: data.id as string },
        data,
      });

      if (review.productId) {
        await this.updateProductRating(review.productId, tx);
      }

      if (review.shopId) {
        await this.updateShopRating(review.shopId, tx);
      }

      return review;
    });
  }

  delete(data: Prisma.ReviewViewWhereUniqueInput) {
    return this.prismaService.reviewView.delete({
      where: { id: data.id as string },
    });
  }
}
