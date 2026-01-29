import { UserData } from '@common/decorators/user-data.decorator';
import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { Observable, filter, map } from 'rxjs';
import { PaymentSubscriber } from '../subscribers/payment.subscriber';

@Controller('payment')
export class PaymentSseController {
  constructor(private readonly sub: PaymentSubscriber) {}

  @Sse('sse')
  handle(@UserData('userId') userId: string): Observable<MessageEvent> {
    return this.sub.stream().pipe(
      filter((evt) => evt.data?.userId === userId),
      map((evt) => ({
        ...evt,
        data: evt.data,
      }))
    );
  }
}
