import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionWriteService } from './services/transaction-write.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.PAYMENT_SERVICE)]),
  ],
  controllers: [TransactionController],
  providers: [TransactionWriteService],
})
export class PaymentModule {}
