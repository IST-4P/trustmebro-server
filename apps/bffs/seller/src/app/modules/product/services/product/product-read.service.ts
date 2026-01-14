import {
  GetManyProductsRequest,
  GetManyProductsResponse,
  GetProductRequest,
  GetProductResponse,
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
} from '@common/interfaces/proto-types/query';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductReadService implements OnModuleInit {
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
  }

  async getManyProducts(
    data: GetManyProductsRequest
  ): Promise<GetManyProductsResponse> {
    return firstValueFrom(this.queryService.getManyProducts(data));
  }

  async getProduct(data: GetProductRequest): Promise<GetProductResponse> {
    return firstValueFrom(this.queryService.getProduct(data));
  }
}
