import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CancelOrderRequest,
  CreateOrderRequest,
  UpdateStatusOrderRequest,
} from '@common/interfaces/models/order';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from '../services/order.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class OrderGrpcController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod(GrpcServiceName.ORDER_SERVICE, 'CreateOrder')
  createOrder(data: CreateOrderRequest) {
    return this.orderService.create(data);
  }

  @GrpcMethod(GrpcServiceName.ORDER_SERVICE, 'CancelOrder')
  cancelOrder(data: CancelOrderRequest) {
    return this.orderService.cancelOrder(data);
  }

  @GrpcMethod(GrpcServiceName.ORDER_SERVICE, 'UpdateStatusOrder')
  updateStatusOrder(data: UpdateStatusOrderRequest) {
    return this.orderService.updateStatus(data);
  }
}
