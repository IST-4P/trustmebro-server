import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { OrderGrpcController } from './controllers/order-grpc.controller';
import { PrismaModule } from './prisma/prisma.module';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';

@Module({
  imports: [
    PrismaModule,
    ClientsModule.register([
      GrpcClientProvider(GrpcService.PRODUCT_SERVICE),
      GrpcClientProvider(GrpcService.CART_SERVICE),
    ]),
    KafkaModule.register(QueueService.ORDER_SERVICE),
    LoggerModule.forRoot('order'),
  ],
  controllers: [OrderGrpcController],
  providers: [OrderRepository, OrderService],
})
export class AppModule {}
