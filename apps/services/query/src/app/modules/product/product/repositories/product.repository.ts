import {
  ProductStatusValues,
  SortByValues,
} from '@common/constants/product.constant';
import {
  GetManyProductsRequest,
  GetProductRequest,
} from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyProductsRequest) {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;
    let where: Prisma.ProductViewWhereInput = {
      status: data.status ? data.status : ProductStatusValues.ACTIVE,
      shopId: data.shopId ? data.shopId : undefined,
    };

    if (data.name) {
      where.name = {
        contains: data.name,
        mode: 'insensitive',
      };
    }

    if (data.provinceId) {
      where.provinceId = data.provinceId;
    }

    if (data.brandIds && data.brandIds.length > 0) {
      where.brandId = {
        in: data.brandIds,
      };
    }

    if (data.categories && data.categories.length > 0) {
      where.categoryIds = {
        hasSome: data.categories,
      };
    }

    if (data.minPrice !== undefined || data.maxPrice !== undefined) {
      where.virtualPrice = {
        gte: data.minPrice,
        lte: data.maxPrice,
      };
    }
    // Mắc định sort theo createdAt mới nhất
    let calculatedOrderBy:
      | Prisma.ProductViewOrderByWithRelationInput
      | Prisma.ProductViewOrderByWithRelationInput[] = {
      createdAt: data.orderBy,
    };

    if (data.sortBy === SortByValues.Price) {
      calculatedOrderBy = {
        basePrice: data.orderBy,
      };
    } else if (data.sortBy === SortByValues.Sale) {
      calculatedOrderBy = {
        soldCount: data.orderBy,
      };
    }

    const [totalItems, products] = await Promise.all([
      this.prismaService.productView.count({
        where,
      }),
      this.prismaService.productView.findMany({
        where,
        orderBy: calculatedOrderBy,
        skip,
        take,
        select: {
          id: true,
          name: true,
          basePrice: true,
          virtualPrice: true,
          images: true,
          status: true,
          averageRate: true,
          soldCount: true,
        },
      }),
    ]);

    const productIds = products.map((product) => product.id);
    const productRatings = await this.prismaService.productRatingView.findMany({
      where: {
        productId: {
          in: productIds,
        },
      },
    });
    const productWithRating = products.map((product) => {
      const rating = productRatings.find(
        (rating) => rating.productId === product.id
      );
      return {
        ...product,
        averageRate: rating?.averageRating || 0,
        ratingCount: rating?.totalReviews || 0,
      };
    });
    return {
      products: productWithRating,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  async findById(data: GetProductRequest) {
    const product = await this.prismaService.productView.findUnique({
      where: data,
    });
    if (!product) {
      throw new NotFoundException('Error.ProductNotFound');
    }

    const productRating = await this.prismaService.productRatingView.findUnique(
      {
        where: {
          productId: product.id,
        },
      }
    );
    return {
      ...product,
      averageRate: productRating?.averageRating || 0,
      ratingCount: productRating?.totalReviews || 0,
    };
  }

  create(data: Prisma.ProductViewCreateInput) {
    return this.prismaService.productView.create({
      data,
    });
  }

  update(data: Prisma.ProductViewUpdateInput) {
    return this.prismaService.productView.update({
      where: { id: data.id as string },
      data,
    });
  }

  delete(data: Prisma.ProductViewWhereUniqueInput) {
    return this.prismaService.productView.delete({
      where: { id: data.id as string },
    });
  }
}
