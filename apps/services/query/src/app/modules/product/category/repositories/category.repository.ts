import {
  GetManyCategoriesRequest,
  GetManyCategoriesResponse,
} from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(
    data: GetManyCategoriesRequest
  ): Promise<GetManyCategoriesResponse> {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    const [totalItems, categories] = await Promise.all([
      this.prismaService.categoryView.count({
        where: {
          name: data.name
            ? { contains: data.name, mode: 'insensitive' }
            : undefined,
        },
      }),
      this.prismaService.categoryView.findMany({
        where: {
          name: data.name
            ? { contains: data.name, mode: 'insensitive' }
            : undefined,
        },
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

  findById(id: string) {
    return this.prismaService.categoryView.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.CategoryViewCreateInput) {
    return this.prismaService.categoryView.create({
      data,
    });
  }

  update(data: Prisma.CategoryViewUpdateInput) {
    return this.prismaService.categoryView.update({
      where: { id: data.id as string },
      data,
    });
  }

  delete(data: Prisma.CategoryViewWhereUniqueInput) {
    return this.prismaService.categoryView.delete({
      where: { id: data.id as string },
    });
  }
}
