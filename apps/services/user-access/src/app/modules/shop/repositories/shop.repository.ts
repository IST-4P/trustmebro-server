import {
  CreateShopRequest,
  GetShopRequest,
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
