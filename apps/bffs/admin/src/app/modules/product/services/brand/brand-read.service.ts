import {
  GetBrandRequest,
  GetBrandResponse,
  GetManyBrandsRequest,
  GetManyBrandsResponse,
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
} from '@common/interfaces/proto-types/query';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BrandReadService implements OnModuleInit {
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
  }

  async getManyBrands(
    data: GetManyBrandsRequest
  ): Promise<GetManyBrandsResponse> {
    return firstValueFrom(this.queryService.getManyBrands(data));
  }

  async getBrand(data: GetBrandRequest): Promise<GetBrandResponse> {
    return firstValueFrom(this.queryService.getBrand(data));
  }
}
