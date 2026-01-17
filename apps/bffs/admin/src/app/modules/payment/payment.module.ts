import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PaymentController } from './controllers/payment.controller';
import { PaymentReadService } from './services/payment-read.service';
import { PaymentWriteService } from './services/payment-write.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.PAYMENT_SERVICE)]),
  ],
  controllers: [PaymentController],
  providers: [PaymentWriteService, PaymentReadService],
})
export class PaymentModule {}
