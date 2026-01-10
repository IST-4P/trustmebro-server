import { GrpcServiceName } from '@common/constants/grpc.constant';

import { WebhookTransactionRequest } from '@common/interfaces/models/payment/transaction';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { TransactionService } from '../services/transaction.service';

@Controller()
export class TransactionGrpcController {
  constructor(private readonly transactionService: TransactionService) {}

  @GrpcMethod(GrpcServiceName.PAYMENT_SERVICE, 'Receiver')
  receiver(data: WebhookTransactionRequest) {
    return this.transactionService.receiver(data);
  }
}
