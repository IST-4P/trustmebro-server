import { UserData } from '@common/decorators/user-data.decorator';
import { Controller, MessageEvent, Sse } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Observable, filter, map } from 'rxjs';
import { ConversationSubscriber } from '../subscribers/conversation.subscriber';

@Controller('chat/conversation')
@ApiTags('Chat')
export class ConversationSseController {
  constructor(private readonly sub: ConversationSubscriber) {}

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
