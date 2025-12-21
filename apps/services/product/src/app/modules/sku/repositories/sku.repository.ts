import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/product';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class SKURepository {
  constructor(private readonly prismaService: PrismaService) {}

  findById(data: Prisma.SKUWhereUniqueInput) {
    return this.prismaService.sKU.findUnique({
      where: {
        id: data.id,
        deletedAt: null,
      },
      include: {
        product: true,
      },
    });
  }
}
