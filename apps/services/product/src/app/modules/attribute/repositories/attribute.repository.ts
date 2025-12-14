import {
  GetManyAttributesRequest,
  GetManyAttributesResponse,
} from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { Attribute, Prisma } from '@prisma-client/product';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AttributeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(
    data: GetManyAttributesRequest
  ): Promise<GetManyAttributesResponse> {
    let where: Prisma.AttributeWhereInput = {
      deletedAt: null,
    };

    if (data.key) {
      where.key = { contains: data.key, mode: 'insensitive' };
    }

    if (data.category) {
      where.categories = {
        some: {
          categoryId: data.category,
        },
      };
    }

    const attributes = await this.prismaService.attribute.findMany({
      where,
    });

    return {
      attributes,
    };
  }

  findById(id: string): Promise<Attribute | null> {
    return this.prismaService.attribute.findUnique({
      where: { id },
    });
  }

  create(data: Prisma.AttributeCreateInput): Promise<Attribute> {
    return this.prismaService.attribute.create({
      data,
    });
  }

  update(data: Prisma.AttributeUpdateInput): Promise<Attribute> {
    return this.prismaService.attribute.update({
      where: {
        id: data.id as string,
        updatedById: data?.updatedById as string,
      },
      data,
    });
  }

  delete(
    data: Prisma.AttributeWhereInput,
    isHard?: boolean
  ): Promise<Attribute> {
    return isHard
      ? this.prismaService.attribute.delete({
          where: {
            id: data.id as string,
          },
        })
      : this.prismaService.attribute.update({
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
