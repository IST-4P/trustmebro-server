import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AuthController } from './controllers/auth.controller';
import { ShopController } from './controllers/shop.controller';
import { UserController } from './controllers/user.controller';
import { AuthService } from './services/auth.service';
import { ShopService } from './services/shop.service';
import { UserService } from './services/user.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
    ]),
  ],
  controllers: [AuthController, UserController, ShopController],
  providers: [AuthService, UserService, ShopService],
})
export class UserAccessModule {}
