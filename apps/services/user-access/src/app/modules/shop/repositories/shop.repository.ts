import {
  CreateShopRequest,
  GetManyShopsRequest,
  GetShopRequest,
  UpdateShopRatingRequest,
  UpdateShopRequest,
  ValidateShopsRequest,
} from '@common/interfaces/models/user-access';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/user-access';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ShopRepository {
  constructor(private readonly prismaService: PrismaService) {}

  find(data: GetShopRequest) {
    const where: Prisma.ShopWhereUniqueInput = {
      id: data?.id || undefined,
      ownerId: data?.userId || undefined,
    };
    return this.prismaService.shop.findUnique({
      where,
    });
  }

  async list(data: GetManyShopsRequest) {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    const [totalItems, shops] = await Promise.all([
      this.prismaService.shop.count({
        where: {
          isOpen: data?.isOpen || undefined,
        },
      }),
      this.prismaService.shop.findMany({
        where: {
          isOpen: data?.isOpen || undefined,
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return {
      shops,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  create({ ownerId, ...data }: CreateShopRequest) {
    return this.prismaService.shop.create({
      data: {
        ...data,
        user: {
          connect: { id: ownerId },
        },
        createdById: ownerId,
        updatedById: ownerId,
      },
    });
  }

  update({ id, ownerId, ...data }: UpdateShopRequest) {
    return this.prismaService.shop.update({
      where: { id, ownerId },
      data,
    });
  }

  updateRating(data: UpdateShopRatingRequest) {
    return this.prismaService.shop.update({
      where: { id: data.id },
      data: {
        rating: data.rating,
      },
    });
  }

  validateShops(data: ValidateShopsRequest) {
    return this.prismaService.shop.findMany({
      where: {
        id: { in: data.shopIds },
      },
      select: {
        id: true,
        name: true,
      },
    });
  }
}
