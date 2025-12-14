import {
  GetManyCategoriesRequest,
  GetManyCategoriesResponse,
} from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { Category, Prisma } from '@prisma-client/product';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(
    data: GetManyCategoriesRequest
  ): Promise<GetManyCategoriesResponse> {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    let where: Prisma.CategoryWhereInput = {
      deletedAt: null,
    };

    if (data.name) {
      where.name = { contains: data.name, mode: 'insensitive' };
    }

    const [totalItems, categories] = await Promise.all([
      this.prismaService.category.count({
        where,
      }),
      this.prismaService.category.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
    ]);
    return {
      categories,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  findById(id: string): Promise<Category | null> {
    return this.prismaService.category.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.CategoryCreateInput): Promise<Category> {
    return this.prismaService.category.create({
      data,
    });
  }

  update(data: Prisma.CategoryUpdateInput): Promise<Category> {
    return this.prismaService.category.update({
      where: {
        id: data.id as string,
        updatedById: data?.updatedById as string,
      },
      data,
    });
  }

  delete(data: Prisma.CategoryWhereInput, isHard?: boolean): Promise<Category> {
    return isHard
      ? this.prismaService.category.delete({
          where: {
            id: data.id as string,
          },
        })
      : this.prismaService.category.update({
          where: {
            id: data.id as string,
            deletedAt: null,
          },
          data: {
            deletedAt: new Date(),
            deletedById: data.deletedById as string,
          },
        });
  }
}
