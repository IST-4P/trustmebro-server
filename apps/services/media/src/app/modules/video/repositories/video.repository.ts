import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/media';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VideoRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.VideoCreateInput) {
    return this.prismaService.video.create({
      data: {
        ...data,
        createdById: data.userId,
      },
    });
  }

  async update(data: Prisma.VideoUpdateInput) {
    const id = data.id as string;
    const { id: _, ...updateData } = data;
    const maxRetries = 3;
    const retryDelay = 500; // ms

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await this.prismaService.video.update({
          where: { id },
          data: updateData,
        });
      } catch (error) {
        // Nếu không tìm thấy record và còn lượt retry
        if (error.code === 'P2025' && attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
          continue;
        }
        throw error;
      }
    }
  }

  delete(data: Prisma.VideoWhereInput, isHard?: boolean) {
    return isHard
      ? this.prismaService.video.delete({
          where: {
            id: data.id as string,
          },
        })
      : this.prismaService.video.update({
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
