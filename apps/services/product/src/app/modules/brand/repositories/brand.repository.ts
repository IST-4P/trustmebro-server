import {
  GetManyBrandsRequest,
  GetManyBrandsResponse,
} from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { Brand, Prisma } from '@prisma-client/product';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class BrandRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyBrandsRequest): Promise<GetManyBrandsResponse> {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    let where: Prisma.BrandWhereInput = {
      deletedAt: null,
    };

    if (data.name) {
      where.name = { contains: data.name, mode: 'insensitive' };
    }

    const [totalItems, brands] = await Promise.all([
      this.prismaService.brand.count({
        where,
      }),
      this.prismaService.brand.findMany({
        where,
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

  findById(id: string): Promise<Brand | null> {
    return this.prismaService.brand.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.BrandCreateInput): Promise<Brand> {
    return this.prismaService.brand.create({
      data,
    });
  }

  update(data: Prisma.BrandUpdateInput): Promise<Brand> {
    return this.prismaService.brand.update({
      where: {
        id: data.id as string,
        updatedById: data?.updatedById as string,
      },
      data,
    });
  }

  delete(data: Prisma.BrandWhereInput, isHard?: boolean): Promise<Brand> {
    return isHard
      ? this.prismaService.brand.delete({
          where: {
            id: data.id as string,
          },
        })
      : this.prismaService.brand.update({
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
