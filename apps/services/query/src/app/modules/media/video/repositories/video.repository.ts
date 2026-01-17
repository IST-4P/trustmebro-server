import {
  GetManyVideosRequest,
  GetVideoRequest,
} from '@common/interfaces/models/media';
import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class VideoRepository {
  private readonly logger = new Logger(VideoRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyVideosRequest) {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    const whereClause: Prisma.VideoViewWhereInput = {
      authorId: data.userId ? data.userId : undefined,
      status: data.status ? data.status : undefined,
      title: data.title
        ? { contains: data.title, mode: 'insensitive' }
        : undefined,
    };

    const [totalItems, videos] = await Promise.all([
      this.prismaService.videoView.count({
        where: whereClause,
      }),
      this.prismaService.videoView.findMany({
        where: whereClause,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          size: true,
          duration: true,
          width: true,
          height: true,
          status: true,
          title: true,
          likeCount: true,
          commentCount: true,
          authorId: true,
        },
      }),
    ]);
    return {
      videos,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  async findById(data: GetVideoRequest) {
    return this.prismaService.videoView.findUnique({
      where: data,
    });
  }

  async upsert(data: Prisma.VideoViewCreateInput) {
    const maxRetries = 3;
    const retryDelay = 300;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.prismaService.videoView.upsert({
          where: { id: data.id },
          create: data,
          update: data,
        });
      } catch (error) {
        if (attempt < maxRetries) {
          this.logger.warn(
            `Upsert failed (attempt ${attempt}/${maxRetries}): ${error.message}`
          );
          await new Promise((resolve) =>
            setTimeout(resolve, retryDelay * attempt)
          );
        } else {
          throw error;
        }
      }
    }
  }

  delete(data: Prisma.VideoViewWhereUniqueInput) {
    return this.prismaService.videoView.delete({
      where: { id: data.id },
    });
  }
}
