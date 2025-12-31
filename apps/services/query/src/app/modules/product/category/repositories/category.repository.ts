import { GetManyCategoriesRequest } from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyCategoriesRequest) {
    return this.prismaService.categoryView.findMany({
      where: {
        parentId: data.parentCategoryId ? data.parentCategoryId : null,
      },
      orderBy: { name: 'asc' },
    });
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
