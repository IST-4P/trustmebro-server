import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/product';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AttributeRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(
    data: Prisma.AttributeCreateInput & {
      categoryId?: string;
      isRequired?: boolean;
    }
  ) {
    return this.prismaService.attribute.create({
      data: {
        id: data.id,
        name: data.name,
        createdById: data.createdById,
        ...(data.categoryId && {
          categories: {
            create: [
              {
                categoryId: data.categoryId,
                isRequired: data.isRequired,
              },
            ],
          },
        }),
      },
      include: {
        categories: {
          select: {
            isRequired: true,
            category: {
              select: {
                id: true,
                name: true,
                logo: true,
                parentCategoryId: true,
              },
            },
          },
        },
      },
    });
  }

  update(data: Prisma.AttributeUpdateInput) {
    return this.prismaService.attribute.update({
      where: {
        id: data.id as string,
        updatedById: data?.updatedById as string,
      },
      data,
      include: {
        categories: {
          select: {
            isRequired: true,
            category: {
              select: {
                id: true,
                name: true,
                logo: true,
                parentCategoryId: true,
              },
            },
          },
        },
      },
    });
  }

  delete(data: Prisma.AttributeWhereInput, isHard?: boolean) {
    return isHard
      ? this.prismaService.attribute.delete({
          where: {
            id: data.id as string,
          },
          include: {
            categories: {
              select: {
                isRequired: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    logo: true,
                    parentCategoryId: true,
                  },
                },
              },
            },
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
          include: {
            categories: {
              select: {
                isRequired: true,
                category: {
                  select: {
                    id: true,
                    name: true,
                    logo: true,
                    parentCategoryId: true,
                  },
                },
              },
            },
          },
        });
  }
}
