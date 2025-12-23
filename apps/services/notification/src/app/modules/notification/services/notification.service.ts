import { QueueTopics } from '@common/constants/queue.constant';
import { RedisChannel } from '@common/constants/redis.constant';
import {
  CreateNotificationRequest,
  DeleteNotificationRequest,
  NotificationResponse,
  ReadNotificationRequest,
} from '@common/interfaces/models/notification';
import { KafkaService } from '@common/kafka/kafka.service';
import { RedisService } from '@common/redis/redis/redis.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationRepository } from '../repositories/notification.repository';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly kafkaService: KafkaService,
    private readonly redisService: RedisService
  ) {}

  async create({
    processId,
    ...data
  }: CreateNotificationRequest): Promise<NotificationResponse> {
    const createdNotification = await this.notificationRepository.create(data);
    this.kafkaService.emit(
      QueueTopics.NOTIFICATION.CREATE_NOTIFICATION,
      createdNotification
    );
    await this.redisService.publish(
      RedisChannel.NOTIFICATION_CHANNEL,
      JSON.stringify(createdNotification)
    );
    return createdNotification;
  }

  async read({
    processId,
    ...data
  }: ReadNotificationRequest): Promise<NotificationResponse> {
    try {
      const readNotification = await this.notificationRepository.read(data);
      this.kafkaService.emit(
        QueueTopics.NOTIFICATION.READ_NOTIFICATION,
        readNotification
      );
      return readNotification;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Error.NotificationNotFound');
      }
      throw error;
    }
  }

  async delete(data: DeleteNotificationRequest): Promise<NotificationResponse> {
    try {
      const deletedNotification = await this.notificationRepository.delete(
        data,
        false
      );
      this.kafkaService.emit(
        QueueTopics.NOTIFICATION.DELETE_NOTIFICATION,
        deletedNotification
      );
      return deletedNotification;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Error.NotificationNotFound');
      }
      throw error;
    }
  }
}
