import { RedisConfiguration } from '@common/configurations/redis.config';
import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerModule } from '@common/observability/logger';
import { RedisModule } from '@common/redis/redis/redis.module';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { RemovePaymentCronJob } from './cornjobs/remove-payment.cronjob';
import { RemoveRefundCronJob } from './cornjobs/remove-refund.cronjob';
import { HealthModule } from './modules/health/health.module';
import { PaymentModule } from './modules/payment/payment.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    RedisModule,
    KafkaModule.register(QueueService.PAYMENT_SERVICE),
    LoggerModule.forRoot('payment'),
    BullModule.forRoot({
      connection: {
        url: RedisConfiguration.REDIS_URL,
      },
    }),
    HealthModule,
    PaymentModule,
    TransactionModule,
  ],
  providers: [RemovePaymentCronJob, RemoveRefundCronJob],
})
export class AppModule {}
