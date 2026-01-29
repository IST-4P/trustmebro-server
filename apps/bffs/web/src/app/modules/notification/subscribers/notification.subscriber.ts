import { RedisConfiguration } from '@common/configurations/redis.config';
import { RedisChannel } from '@common/constants/redis.constant';
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
    MessageEvent & { data: { unreadCount: number; userId: string } }
  >();

  async onModuleInit() {
    await this.subscriber.connect();

    await this.subscriber.subscribe(
      RedisChannel.NOTIFICATION_CHANNEL,
      (message) => {
        const notification = JSON.parse(message) as {
          unreadCount: number;
          userId: string;
        };
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

  stream(): Observable<
    MessageEvent & { data: { unreadCount: number; userId: string } }
  > {
    return this.subject.asObservable();
  }
}
