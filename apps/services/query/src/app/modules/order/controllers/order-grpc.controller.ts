import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  GetManyOrdersRequest,
  GetOrderRequest,
} from '@common/interfaces/models/order';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { OrderService } from '../services/order.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class OrderGrpcController {
  constructor(private readonly orderService: OrderService) {}

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetManyOrders')
  getManyOrders(data: GetManyOrdersRequest) {
    return this.orderService.list(data);
  }

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetOrder')
  getOrder(data: GetOrderRequest) {
    return this.orderService.findById(data);
  }
}
