import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { OrderController } from './controllers/order.controller';
import { OrderReadService } from './services/order-read.service';
import { OrderWriteService } from './services/order-write.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.ORDER_SERVICE),
      GrpcClientProvider(GrpcService.QUERY_SERVICE),
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderWriteService, OrderReadService],
})
export class OrderModule {}
