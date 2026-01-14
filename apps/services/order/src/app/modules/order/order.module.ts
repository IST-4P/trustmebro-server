import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { OrderConsumerController } from './controllers/order-consumer.controller';
import { OrderGrpcController } from './controllers/order-grpc.controller';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.PRODUCT_SERVICE),
      GrpcClientProvider(GrpcService.CART_SERVICE),
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
    ]),
  ],
  controllers: [OrderGrpcController, OrderConsumerController],
  providers: [OrderRepository, OrderService],
})
export class OrderModule {}
