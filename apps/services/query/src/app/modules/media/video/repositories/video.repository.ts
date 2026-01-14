import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class VideoRepository {
  private readonly logger = new Logger(VideoRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

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
