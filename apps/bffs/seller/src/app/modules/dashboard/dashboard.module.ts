import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { DashboardController } from './controllers/dashboard.controller';
import { DashBoardService } from './services/dashboard.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.PRODUCT_SERVICE),
      GrpcClientProvider(GrpcService.ORDER_SERVICE),
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashBoardService],
})
export class DashboardModule {}
