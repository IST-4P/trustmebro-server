import { GetPaymentRequest } from '@common/interfaces/models/payment';
import {
  PAYMENT_SERVICE_NAME,
  PAYMENT_SERVICE_PACKAGE_NAME,
  PaymentResponse,
  PaymentServiceClient,
} from '@common/interfaces/proto-types/payment';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentReadService implements OnModuleInit {
  private paymentService!: PaymentServiceClient;

  constructor(
    @Inject(PAYMENT_SERVICE_PACKAGE_NAME)
    private paymentClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentClient.getService<PaymentServiceClient>(PAYMENT_SERVICE_NAME);
  }

  async getPayment(data: GetPaymentRequest): Promise<PaymentResponse> {
    return firstValueFrom(this.paymentService.getPayment(data));
  }
}
