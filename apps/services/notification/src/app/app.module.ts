import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerModule } from '@common/observability/logger';
import { RedisModule } from '@common/redis/redis/redis.module';
import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    KafkaModule.register(QueueService.NOTIFICATION_SERVICE),
    LoggerModule.forRoot('notification'),
    HealthModule,
    NotificationModule,
  ],
})
export class AppModule {}
