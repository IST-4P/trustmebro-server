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
    console.log('🔴 [NotificationSubscriber] Connecting to Redis...');
    await this.subscriber.connect();
    console.log('✅ [NotificationSubscriber] Connected to Redis');

    await this.subscriber.subscribe(
      RedisChannel.NOTIFICATION_CHANNEL,
      (message) => {
        console.log('📨 [NotificationSubscriber] Received message:', message);
        const notification = JSON.parse(message);
        console.log('📤 [NotificationSubscriber] Emitting to gateway...');
        this.notificationGateway.create(notification);
      }
    );
    console.log(
      '✅ [NotificationSubscriber] Subscribed to channel:',
      RedisChannel.NOTIFICATION_CHANNEL
    );
  }
}
