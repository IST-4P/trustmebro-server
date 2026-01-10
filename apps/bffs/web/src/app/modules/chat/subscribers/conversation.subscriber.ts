import { RedisConfiguration } from '@common/configurations/redis.config';
import { RedisChannel } from '@common/constants/redis.constant';
import { GetManyConversationsResponse } from '@common/interfaces/proto-types/chat';
import {
  Injectable,
  MessageEvent,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { createClient } from 'redis';
import { Observable, Subject } from 'rxjs';
import { ConversationReadService } from '../services/conversation-read.service';

@Injectable()
export class ConversationSubscriber implements OnModuleInit, OnModuleDestroy {
  private subscriber = createClient({ url: RedisConfiguration.REDIS_URL });
  private readonly subject = new Subject<
    MessageEvent & { data: GetManyConversationsResponse & { userId: string } }
  >();

  constructor(
    private readonly conversationReadService: ConversationReadService
  ) {}

  async onModuleInit() {
    await this.subscriber.connect();

    await this.subscriber.subscribe(
      RedisChannel.UPDATE_CONVERSATION_CHANNEL,
      async (message) => {
        const conversation = JSON.parse(message) as {
          participantIds: string[];
        };
        const result = await this.conversationReadService.refreshConversation(
          conversation.participantIds
        );
        this.subject.next({
          data: {
            ...result[conversation.participantIds[0]],
            userId: conversation.participantIds[0],
          },
          type: 'conversation',
        });
        this.subject.next({
          data: {
            ...result[conversation.participantIds[1]],
            userId: conversation.participantIds[1],
          },
          type: 'conversation',
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
    MessageEvent & { data: GetManyConversationsResponse & { userId: string } }
  > {
    return this.subject.asObservable();
  }
}
