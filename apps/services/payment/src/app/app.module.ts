import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    KafkaModule.register(QueueService.PAYMENT_SERVICE),
    LoggerModule.forRoot('payment'),
  ],
})
export class AppModule {}
