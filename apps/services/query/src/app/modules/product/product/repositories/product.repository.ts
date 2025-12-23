import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class ProductRepository {
  constructor(private readonly prismaService: PrismaService) {}

  // async list(data: GetManyProductsRequest): Promise<GetManyProductsResponse> {
  //   const skip = (data.page - 1) * data.limit;
  //   const take = data.limit;

  //   const [totalItems, brands] = await Promise.all([
  //     this.prismaService.brandView.count({
  //       where: {
  //         name: data.name
  //           ? { contains: data.name, mode: 'insensitive' }
  //           : undefined,
  //       },
  //     }),
  //     this.prismaService.brandView.findMany({
  //       where: {
  //         name: data.name
  //           ? { contains: data.name, mode: 'insensitive' }
  //           : undefined,
  //       },
  //       skip,
  //       take,
  //       orderBy: { name: 'asc' },
  //     }),
  //   ]);
  //   return {
  //     brands,
  //     totalItems,
  //     page: data.page,
  //     limit: data.limit,
  //     totalPages: Math.ceil(totalItems / data.limit),
  //   };
  // }

  // findById(id: string) {
  //   return this.prismaService.brandView.findUnique({
  //     where: { id },
  //   });
  // }

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
