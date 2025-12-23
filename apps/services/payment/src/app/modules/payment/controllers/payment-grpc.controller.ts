import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { CreatePaymentRequest } from '@common/interfaces/models/payment';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PaymentService } from '../services/payment.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class PaymentGrpcController {
  constructor(private readonly paymentService: PaymentService) {}

  @GrpcMethod(GrpcServiceName.PAYMENT_SERVICE, 'CreatePayment')
  createPayment(data: CreatePaymentRequest) {
    return this.paymentService.create(data);
  }
}
