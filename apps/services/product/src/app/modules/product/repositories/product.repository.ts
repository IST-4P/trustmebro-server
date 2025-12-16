import {
  ProductStatusValues,
  SortByValues,
} from '@common/constants/product.constant';
import {
  CreateProductRequest,
  GetManyProductsRequest,
  GetManyProductsResponse,
  GetProductRequest,
} from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/product';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyProductsRequest): Promise<GetManyProductsResponse> {
    const skip = Number((data.page - 1) * data.limit);
    const take = Number(data.limit);
    let where: Prisma.ProductWhereInput = {
      deletedAt: null,
      status: data.status ? data.status : ProductStatusValues.ACTIVE,
      createdById: data.createdById ? data.createdById : undefined,
    };

    if (data.name) {
      where.name = {
        contains: data.name,
        mode: 'insensitive',
      };
    }

    if (data.brandIds && data.brandIds.length > 0) {
      where.brandId = {
        in: data.brandIds,
      };
    }

    if (data.categories && data.categories.length > 0) {
      where.categories = {
        some: {
          id: {
            in: data.categories,
          },
        },
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
      | Prisma.ProductOrderByWithRelationInput
      | Prisma.ProductOrderByWithRelationInput[] = {
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
      this.prismaService.product.count({
        where,
      }),
      this.prismaService.product.findMany({
        where,
        orderBy: calculatedOrderBy,
        skip,
        take,
        select: {
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
    return {
      products,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  findById(data: GetProductRequest) {
    let where: Prisma.ProductWhereUniqueInput = {
      id: data.id,
      deletedAt: null,
    };

    if (data.isHidden !== undefined) {
      where.isHidden = data.isHidden;
    }
    return this.prismaService.product.findUnique({
      where,
      include: {
        skus: {
          where: {
            deletedAt: null,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            parentCategory: true,
          },
        },
      },
    });
  }

  create(data: CreateProductRequest) {
    const { skus, categories, brandId, ...productData } = data;
    return this.prismaService.product.create({
      data: {
        ...productData,
        createdById: data.createdById,
        brand: {
          connect: { id: brandId },
        },
        categories: {
          connect: categories.map((category) => ({ id: category })),
        },
        skus: {
          createMany: {
            data: skus.map((sku) => ({
              ...sku,
              createdById: data.createdById,
            })),
          },
        },
      },
      include: {
        skus: {
          where: {
            deletedAt: null,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
          },
        },
        categories: {
          where: {
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            parentCategory: true,
          },
        },
      },
    });
  }
}
