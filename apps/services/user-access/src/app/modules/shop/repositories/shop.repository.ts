import {
  CreateShopRequest,
  GetShopRequest,
  UpdateShopRequest,
} from '@common/interfaces/models/user-access';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ShopRepository {
  constructor(private readonly prismaService: PrismaService) {}

  find(data: GetShopRequest) {
    return this.prismaService.shop.findUnique({
      where: { id: data.id },
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
}
