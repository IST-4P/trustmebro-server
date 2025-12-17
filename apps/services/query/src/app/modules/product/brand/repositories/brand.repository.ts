import {
  GetManyBrandsRequest,
  GetManyBrandsResponse,
} from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyBrandsRequest): Promise<GetManyBrandsResponse> {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    const [totalItems, brands] = await Promise.all([
      this.prismaService.brandView.count({
        where: {
          name: data.name
            ? { contains: data.name, mode: 'insensitive' }
            : undefined,
        },
      }),
      this.prismaService.brandView.findMany({
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
      brands,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  findById(id: string) {
    return this.prismaService.brandView.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.BrandViewCreateInput) {
    return this.prismaService.brandView.create({
      data,
    });
  }

  update(data: Prisma.BrandViewUpdateInput) {
    return this.prismaService.brandView.update({
      where: { id: data.id as string },
      data,
    });
  }

  delete(data: Prisma.BrandViewWhereUniqueInput) {
    return this.prismaService.brandView.delete({
      where: { id: data.id as string },
    });
  }
}
