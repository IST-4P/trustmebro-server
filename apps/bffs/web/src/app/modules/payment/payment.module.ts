import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PaymentController } from './controllers/payment.controller';
import { TransactionController } from './controllers/transaction.controller';
import { PaymentReadService } from './services/payment-read.service';
import { TransactionWriteService } from './services/transaction-write.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.PAYMENT_SERVICE)]),
  ],
  controllers: [TransactionController, PaymentController],
  providers: [TransactionWriteService, PaymentReadService],
})
export class PaymentModule {}
