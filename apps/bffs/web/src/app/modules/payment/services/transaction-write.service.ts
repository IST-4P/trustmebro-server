import {
  PAYMENT_SERVICE_NAME,
  PAYMENT_SERVICE_PACKAGE_NAME,
  PaymentServiceClient,
  WebhookTransactionRequest,
  WebhookTransactionResponse,
} from '@common/interfaces/proto-types/payment';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TransactionWriteService implements OnModuleInit {
  private paymentService!: PaymentServiceClient;

  constructor(
    @Inject(PAYMENT_SERVICE_PACKAGE_NAME)
    private paymentClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentClient.getService<PaymentServiceClient>(PAYMENT_SERVICE_NAME);
  }

  async receiver(
    data: WebhookTransactionRequest
  ): Promise<WebhookTransactionResponse> {
    return firstValueFrom(this.paymentService.receiver(data));
  }
}
