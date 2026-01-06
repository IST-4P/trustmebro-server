import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class VideoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.VideoViewCreateInput) {
    return this.prismaService.videoView.create({
      data,
    });
  }

  update(data: Prisma.VideoViewUpdateInput) {
    return this.prismaService.videoView.update({
      where: { id: data.id as string },
      data,
    });
  }

  delete(data: Prisma.VideoViewWhereUniqueInput) {
    return this.prismaService.videoView.delete({
      where: { id: data.id as string },
    });
  }
}
