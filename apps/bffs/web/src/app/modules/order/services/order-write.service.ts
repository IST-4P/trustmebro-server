import {
  CreateOrderRequest,
  CreateOrderResponse,
  ORDER_SERVICE_NAME,
  ORDER_SERVICE_PACKAGE_NAME,
  OrderServiceClient,
} from '@common/interfaces/proto-types/order';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderWriteService implements OnModuleInit {
  private orderService!: OrderServiceClient;

  constructor(
    @Inject(ORDER_SERVICE_PACKAGE_NAME)
    private orderClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.orderService =
      this.orderClient.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  createOrder(data: CreateOrderRequest): Promise<CreateOrderResponse> {
    return firstValueFrom(this.orderService.createOrder(data));
  }
}
