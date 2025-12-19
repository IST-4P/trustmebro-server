import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/notification';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(data: Prisma.NotificationCreateInput) {
    return this.prismaService.notification.create({
      data,
    });
  }

  read(data: Prisma.NotificationUpdateInput) {
    return this.prismaService.notification.update({
      where: {
        id: data.id as string,
        updatedById: data?.updatedById as string,
      },
      data: {
        updatedById: data.updatedById,
        isRead: true,
      },
    });
  }

  delete(data: Prisma.NotificationWhereInput, isHard?: boolean) {
    return isHard
      ? this.prismaService.notification.delete({
          where: {
            id: data.id as string,
          },
        })
      : this.prismaService.notification.update({
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
