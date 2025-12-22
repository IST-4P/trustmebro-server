import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { Module } from '@nestjs/common';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';

@Module({
  imports: [KafkaModule.register(QueueService.ORDER_SERVICE)],
  controllers: [],
  providers: [OrderRepository, OrderService],
})
export class AppModule {}
