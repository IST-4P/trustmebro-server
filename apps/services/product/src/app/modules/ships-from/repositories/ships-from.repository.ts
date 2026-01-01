import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/product';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ShipsFromRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.ShipsFromCreateInput) {
    return this.prismaService.shipsFrom.create({
      data,
    });
  }

  update(data: Prisma.ShipsFromUpdateInput) {
    return this.prismaService.shipsFrom.update({
      where: {
        id: data.id as string,
        updatedById: data?.updatedById as string,
      },
      data,
    });
  }

  delete(data: Prisma.ShipsFromWhereInput, isHard?: boolean) {
    return isHard
      ? this.prismaService.shipsFrom.delete({
          where: {
            id: data.id as string,
          },
        })
      : this.prismaService.shipsFrom.update({
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
