import {
  GetManyNotificationsRequest,
  GetManyNotificationsResponse,
  NotificationResponse,
} from '@common/interfaces/models/notification';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationMapper } from '../mappers/notification.mapper';
import { NotificationRepository } from '../repositories/notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async list(
    data: GetManyNotificationsRequest
  ): Promise<GetManyNotificationsResponse> {
    const notifications = await this.notificationRepository.list(data);
    if (notifications.totalItems === 0) {
      throw new NotFoundException('Error.NotificationNotFound');
    }
    return notifications;
  }

  create(data: NotificationResponse) {
    return this.notificationRepository.create(NotificationMapper(data));
  }

  read(data: NotificationResponse) {
    return this.notificationRepository.read(NotificationMapper(data));
  }

  delete(data: NotificationResponse) {
    return this.notificationRepository.delete({ id: data.id });
  }
}
