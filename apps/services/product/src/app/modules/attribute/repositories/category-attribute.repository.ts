import {
  GetManyCategoryAttributesRequest,
  GetManyCategoryAttributesResponse,
} from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { CategoryAttribute, Prisma } from '@prisma-client/product';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CategoryAttributeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(
    data: GetManyCategoryAttributesRequest
  ): Promise<GetManyCategoryAttributesResponse> {
    let where: Prisma.CategoryAttributeWhereInput = {};

    if (data.categoryId) {
      where.categoryId = data.categoryId;
    }

    if (data.attributeId) {
      where.attributeId = data.attributeId;
    }

    if (data.isRequired !== undefined) {
      where.isRequired = data.isRequired;
    }

    const categoryAttributes =
      await this.prismaService.categoryAttribute.findMany({
        where,
        include: {
          category: true,
          attribute: true,
        },
      });

    return {
      categoryAttributes,
    };
  }

  findById(id: string): Promise<CategoryAttribute | null> {
    return this.prismaService.categoryAttribute.findUnique({
      where: { id },
      include: {
        category: true,
        attribute: true,
      },
    });
  }

  findByCategoryAndAttribute(
    categoryId: string,
    attributeId: string
  ): Promise<CategoryAttribute | null> {
    return this.prismaService.categoryAttribute.findUnique({
      where: {
        categoryId_attributeId: {
          categoryId,
          attributeId,
        },
      },
    });
  }

  create(
    data: Prisma.CategoryAttributeCreateInput
  ): Promise<CategoryAttribute> {
    return this.prismaService.categoryAttribute.create({
      data,
      include: {
        category: true,
        attribute: true,
      },
    });
  }

  update(
    id: string,
    data: Prisma.CategoryAttributeUpdateInput
  ): Promise<CategoryAttribute> {
    return this.prismaService.categoryAttribute.update({
      where: { id },
      data,
      include: {
        category: true,
        attribute: true,
      },
    });
  }

  delete(id: string): Promise<CategoryAttribute> {
    return this.prismaService.categoryAttribute.delete({
      where: { id },
    });
  }
}
