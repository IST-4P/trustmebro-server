import { RedisConfiguration } from '@common/configurations/redis.config';
import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerModule } from '@common/observability/logger';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { PaymentModule } from './modules/payment/payment.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    KafkaModule.register(QueueService.PAYMENT_SERVICE),
    LoggerModule.forRoot('payment'),
    BullModule.forRoot({
      connection: {
        url: RedisConfiguration.REDIS_URL,
      },
    }),
    HealthModule,
    PaymentModule,
  ],
})
export class AppModule {}
