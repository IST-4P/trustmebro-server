import { RedisConfiguration } from '@common/configurations/redis.config';
import { RedisChannel } from '@common/constants/redis.constant';
import { NotificationGateway } from '@common/redis/gateway/notification.gateway';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class NotificationSubscriber implements OnModuleInit {
  private subscriber = createClient({ url: RedisConfiguration.REDIS_URL });

  constructor(private readonly notificationGateway: NotificationGateway) {}

  async onModuleInit() {
    await this.subscriber.connect();

    await this.subscriber.subscribe(
      RedisChannel.NOTIFICATION_CHANNEL,
      (message) => {
        const notification = JSON.parse(message);
        this.notificationGateway.create(notification);
      }
    );
  }
}
