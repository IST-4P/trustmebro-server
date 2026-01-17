import {
  PAYMENT_SERVICE_NAME,
  PAYMENT_SERVICE_PACKAGE_NAME,
  PaymentResponse,
  PaymentServiceClient,
  UpdatePaymentStatusRequest,
} from '@common/interfaces/proto-types/payment';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentWriteService implements OnModuleInit {
  private paymentService!: PaymentServiceClient;

  constructor(
    @Inject(PAYMENT_SERVICE_PACKAGE_NAME)
    private paymentClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.paymentService =
      this.paymentClient.getService<PaymentServiceClient>(PAYMENT_SERVICE_NAME);
  }

  async updatePaymentStatus(
    data: UpdatePaymentStatusRequest
  ): Promise<PaymentResponse> {
    return firstValueFrom(this.paymentService.updatePaymentStatus(data));
  }
}
