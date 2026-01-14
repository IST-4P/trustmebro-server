import { RedisConfiguration } from '@common/configurations/redis.config';
import { RedisChannel } from '@common/constants/redis.constant';
import { NotificationResponse } from '@common/interfaces/models/notification';
import {
  Injectable,
  MessageEvent,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient } from 'redis';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NotificationSubscriber implements OnModuleInit, OnModuleDestroy {
  private subscriber = createClient({ url: RedisConfiguration.REDIS_URL });
  private readonly subject = new Subject<
    MessageEvent & { data: NotificationResponse }
  >();

  async onModuleInit() {
    await this.subscriber.connect();

    await this.subscriber.subscribe(
      RedisChannel.NOTIFICATION_CHANNEL,
      (message) => {
        const notification = JSON.parse(message) as NotificationResponse;
        this.subject.next({
          data: notification,
          type: 'notification',
        });
      }
    );
  }

  async onModuleDestroy() {
    try {
      await this.subscriber.quit();
    } catch {}
    this.subject.complete();
  }

  stream(): Observable<MessageEvent & { data: NotificationResponse }> {
    return this.subject.asObservable();
  }
}
