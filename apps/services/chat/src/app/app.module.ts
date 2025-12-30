import { LoggerModule } from '@common/observability/logger';
import { RedisModule } from '@common/redis/redis/redis.module';
import { Module } from '@nestjs/common';
import { ConversationModule } from './modules/conversation/conversation.module';
import { HealthModule } from './modules/health/health.module';
import { MessageModule } from './modules/message/message.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    LoggerModule.forRoot('chat'),
    HealthModule,
    MessageModule,
    ConversationModule,
  ],
})
export class AppModule {}
