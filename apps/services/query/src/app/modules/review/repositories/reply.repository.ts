import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ReplyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async update(data: Prisma.ReviewViewUpdateInput) {
    return this.prismaService.reviewView.update({
      where: { id: data.id as string },
      data,
    });
  }

  delete(data: Prisma.ReviewViewWhereUniqueInput) {
    return this.prismaService.reviewView.update({
      where: { id: data.id as string },
      data: {
        reply: null,
      },
    });
  }
}
