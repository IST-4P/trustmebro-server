import { UserData } from '@common/decorators/user-data.decorator';
import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable, filter, map } from 'rxjs';
import { NotificationSubscriber } from '../subscribers/notification.subscriber';

@Controller('notification-seller')
export class NotificationSseController {
  constructor(private readonly sub: NotificationSubscriber) {}

  @Sse('sse')
  @ApiTags('Notification')
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
