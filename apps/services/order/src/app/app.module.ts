import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { RemoveOrderCronJob } from './cornjobs/remove-order.cronjob';
import { HealthModule } from './modules/health/health.module';
import { OrderModule } from './modules/order/order.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    KafkaModule.register(QueueService.ORDER_SERVICE),
    LoggerModule.forRoot('order'),
    HealthModule,
    OrderModule,
  ],
  providers: [RemoveOrderCronJob],
})
export class AppModule {}
