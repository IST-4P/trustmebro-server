import { RedisConfiguration } from '@common/configurations/redis.config';
import { RedisChannel } from '@common/constants/redis.constant';
import { WebhookTransactionResponse } from '@common/interfaces/models/payment/transaction';
import {
  Injectable,
  MessageEvent,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient } from 'redis';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class PaymentSubscriber implements OnModuleInit, OnModuleDestroy {
  private subscriber = createClient({ url: RedisConfiguration.REDIS_URL });
  private readonly subject = new Subject<
    MessageEvent & { data: WebhookTransactionResponse }
  >();

  async onModuleInit() {
    await this.subscriber.connect();

    await this.subscriber.subscribe(RedisChannel.PAYMENT_CHANNEL, (message) => {
      const payment = JSON.parse(message) as WebhookTransactionResponse;
      this.subject.next({
        data: payment,
        type: 'payment',
      });
    });
  }

  async onModuleDestroy() {
    try {
      await this.subscriber.quit();
    } catch {}
    this.subject.complete();
  }

  stream(): Observable<MessageEvent & { data: WebhookTransactionResponse }> {
    return this.subject.asObservable();
  }
}
