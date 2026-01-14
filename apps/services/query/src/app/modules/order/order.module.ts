import { Module } from '@nestjs/common';
import { OrderConsumerController } from './controllers/order-consumer.controller';
import { OrderGrpcController } from './controllers/order-grpc.controller';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';

@Module({
  controllers: [OrderConsumerController, OrderGrpcController],
  providers: [OrderRepository, OrderService],
})
export class OrderModule {}
