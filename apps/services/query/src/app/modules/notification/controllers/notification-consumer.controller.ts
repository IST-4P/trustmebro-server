import { QueueTopics } from '@common/constants/queue.constant';
import { NotificationResponse } from '@common/interfaces/models/notification';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { NotificationService } from '../services/notification.service';

@Controller()
export class NotificationConsumerController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern(QueueTopics.NOTIFICATION.CREATE_NOTIFICATION)
  createNotification(@Payload() payload: NotificationResponse) {
    return this.notificationService.create(payload);
  }

  @EventPattern(QueueTopics.NOTIFICATION.READ_NOTIFICATION)
  readNotification(@Payload() payload: NotificationResponse) {
    return this.notificationService.read(payload);
  }

  @EventPattern(QueueTopics.NOTIFICATION.DELETE_NOTIFICATION)
  deleteNotification(@Payload() payload: NotificationResponse) {
    return this.notificationService.delete(payload);
  }
}
