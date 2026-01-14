import {
  GetManyNotificationsRequest,
  GetManyNotificationsResponse,
  GetNotificationRequest,
  GetNotificationResponse,
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

  async list({
    processId,
    ...data
  }: GetManyNotificationsRequest): Promise<GetManyNotificationsResponse> {
    const notifications = await this.notificationRepository.list(data);
    if (notifications.totalItems === 0) {
      throw new NotFoundException('Error.NotificationNotFound');
    }
    return notifications;
  }

  async findById({
    processId,
    ...data
  }: GetNotificationRequest): Promise<GetNotificationResponse> {
    const notification = await this.notificationRepository.findById(data);
    if (!notification) {
      throw new NotFoundException('Error.NotificationNotFound');
    }
    return notification;
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
