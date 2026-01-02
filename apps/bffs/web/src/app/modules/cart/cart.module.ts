import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CartController } from './controllers/cart.controller';
import { CartService } from './services/cart.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.CART_SERVICE)]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
