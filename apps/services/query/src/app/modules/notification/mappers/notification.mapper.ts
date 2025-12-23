import { NotificationResponse } from '@common/interfaces/models/notification';
import { Prisma } from '@prisma-client/query';

export const NotificationMapper = (
  data: NotificationResponse
): Prisma.NotificationViewCreateInput => {
  return {
    id: data.id,
    userId: data.userId,
    title: data.title,
    type: data.type,
    description: data.description,
    isRead: data.isRead,
    image: data.image,
    link: data.link,
    metadata: data.metadata,
    createdAt: new Date(data.createdAt),
    updatedAt: new Date(data.updatedAt),
  };
};
