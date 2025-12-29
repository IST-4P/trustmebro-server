import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CartConsumerController } from './controllers/cart-consumer.controller';
import { CartGrpcController } from './controllers/cart-grpc.controller';
import { PrismaModule } from './prisma/prisma.module';
import { CartItemRepository } from './repositories/cart-item.repository';
import { CartRepository } from './repositories/cart.repository';
import { CartItemService } from './services/cart-item.service';

@Module({
  imports: [
    PrismaModule,
    KafkaModule.register(QueueService.CART_SERVICE),
    ClientsModule.register([GrpcClientProvider(GrpcService.PRODUCT_SERVICE)]),
    LoggerModule.forRoot('cart'),
  ],
  controllers: [CartGrpcController, CartConsumerController],
  providers: [CartItemRepository, CartRepository, CartItemService],
})
export class AppModule {}
