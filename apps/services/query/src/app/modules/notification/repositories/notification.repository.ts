import {
  GetManyNotificationsRequest,
  GetNotificationRequest,
} from '@common/interfaces/models/notification';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client/query';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(data: GetManyNotificationsRequest) {
    const skip = (data.page - 1) * data.limit;
    const take = data.limit;

    const [totalItems, notifications] = await Promise.all([
      this.prismaService.notificationView.count({
        where: {
          userId: data.userId,
          type: data.type ? data.type : undefined,
        },
      }),
      this.prismaService.notificationView.findMany({
        where: {
          userId: data.userId,
          type: data.type ? data.type : undefined,
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return {
      notifications,
      totalItems,
      page: data.page,
      limit: data.limit,
      totalPages: Math.ceil(totalItems / data.limit),
    };
  }

  async findById(data: GetNotificationRequest) {
    return this.prismaService.notificationView.findUnique({
      where: { id: data.id, userId: data.userId },
    });
  }

  create(data: Prisma.NotificationViewCreateInput) {
    return this.prismaService.notificationView.create({
      data,
    });
  }

  read(data: Prisma.NotificationViewUpdateInput) {
    return this.prismaService.notificationView.update({
      where: { id: data.id as string },
      data: {
        isRead: true,
        updatedAt: data.updatedAt,
      },
    });
  }

  delete(data: Prisma.NotificationViewWhereUniqueInput) {
    return this.prismaService.notificationView.delete({
      where: { id: data.id as string },
    });
  }
}
