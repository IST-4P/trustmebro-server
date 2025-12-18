import {
  GetManyShipsFromRequest,
  GetShipsFromRequest,
} from '@common/interfaces/models/product';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class ShipsFromRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyShipsFromRequest) {
    const shipsFromList = await this.prismaService.shipsFromView.findMany({
      where: {
        address: data.address
          ? { contains: data.address, mode: 'insensitive' }
          : undefined,
      },
      orderBy: {
        address: 'desc',
      },
    });
    return {
      shipsFromList,
    };
  }

  findById(data: GetShipsFromRequest) {
    return this.prismaService.shipsFromView.findUnique({
      where: { id: data.id },
    });
  }

  create(data: Prisma.ShipsFromViewCreateInput) {
    return this.prismaService.shipsFromView.create({
      data,
    });
  }

  update(data: Prisma.ShipsFromViewUpdateInput) {
    return this.prismaService.shipsFromView.update({
      where: { id: data.id as string },
      data,
    });
  }

  delete(data: Prisma.ShipsFromViewWhereUniqueInput) {
    return this.prismaService.shipsFromView.delete({
      where: { id: data.id as string },
    });
  }
}
