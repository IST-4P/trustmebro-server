import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AddressController } from './controllers/address.controller';
import { AuthController } from './controllers/auth.controller';
import { ShopController } from './controllers/shop.controller';
import { AddressService } from './services/addesss.service';
import { AuthService } from './services/auth.service';
import { ShopService } from './services/shop.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
    ]),
  ],
  controllers: [AuthController, ShopController, AddressController],
  providers: [AuthService, ShopService, AddressService],
})
export class UserAccessModule {}
