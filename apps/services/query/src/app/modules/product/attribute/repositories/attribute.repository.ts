import {
  GetAttributeRequest,
  GetManyAttributesRequest,
} from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class AttributeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyAttributesRequest) {
    console.log('Data: ', data);
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    const [totalItems, attributes] = await Promise.all([
      this.prismaService.attributeView.count({
        where: {
          name: data.name
            ? { contains: data.name, mode: 'insensitive' }
            : undefined,
        },
      }),
      this.prismaService.attributeView.findMany({
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
      attributes,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  findById(data: GetAttributeRequest) {
    return this.prismaService.attributeView.findUnique({
      where: { id: data.id },
    });
  }

  create(data: Prisma.AttributeViewCreateInput) {
    return this.prismaService.attributeView.create({
      data,
    });
  }

  update(data: Prisma.AttributeViewUpdateInput) {
    return this.prismaService.attributeView.update({
      where: { id: data.id as string },
      data,
    });
  }

  delete(data: Prisma.AttributeViewWhereUniqueInput) {
    return this.prismaService.attributeView.delete({
      where: { id: data.id as string },
    });
  }
}
