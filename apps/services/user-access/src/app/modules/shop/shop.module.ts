import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ShopGrpcController } from './controllers/shop-grpc.controller';
import { ShopRepository } from './repositories/shop.repository';
import { ShopService } from './services/shop.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.ROLE_SERVICE)]),
  ],
  controllers: [ShopGrpcController],
  providers: [ShopRepository, ShopService],
  exports: [ShopService],
})
export class ShopModule {}
