import {
  GetManyOrdersRequest,
  GetManyOrdersResponse,
  GetOrderRequest,
  GetOrderResponse,
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
} from '@common/interfaces/proto-types/query';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderReadService implements OnModuleInit {
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
  }

  async getManyOrders(
    data: GetManyOrdersRequest
  ): Promise<GetManyOrdersResponse> {
    return firstValueFrom(this.queryService.getManyOrders(data));
  }

  async getOrder(data: GetOrderRequest): Promise<GetOrderResponse> {
    return firstValueFrom(this.queryService.getOrder(data));
  }
}
