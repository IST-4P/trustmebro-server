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
    const attributes = await this.prismaService.attributeView.findMany({
      where: {
        name: data.name
          ? { contains: data.name, mode: 'insensitive' }
          : undefined,
        categoryIds: data.categoryId ? { has: data.categoryId } : undefined,
      },
    });
    return {
      attributes,
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
