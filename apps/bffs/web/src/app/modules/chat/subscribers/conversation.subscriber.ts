import { RedisConfiguration } from '@common/configurations/redis.config';
import { RedisChannel } from '@common/constants/redis.constant';
import { ConversationGateway } from '@common/redis/gateway/conversation.gateway';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class ConversationSubscriber implements OnModuleInit {
  private subscriber = createClient({ url: RedisConfiguration.REDIS_URL });

  constructor(private readonly conversationGateway: ConversationGateway) {}

  async onModuleInit() {
    await this.subscriber.connect();

    await this.subscriber.subscribe(
      RedisChannel.UPDATE_CONVERSATION_CHANNEL,
      (message) => {
        const conversation = JSON.parse(message);
        this.conversationGateway.refresh(conversation.participantIds);
      }
    );
  }
}
