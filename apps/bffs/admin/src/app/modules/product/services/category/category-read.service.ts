import {
  GetCategoryRequest,
  GetCategoryResponse,
  GetManyCategoriesRequest,
  GetManyCategoriesResponse,
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
} from '@common/interfaces/proto-types/query';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CategoryReadService implements OnModuleInit {
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
  }

  async getManyCategories(
    data: GetManyCategoriesRequest
  ): Promise<GetManyCategoriesResponse> {
    return firstValueFrom(this.queryService.getManyCategories(data));
  }

  async getCategory(data: GetCategoryRequest): Promise<GetCategoryResponse> {
    return firstValueFrom(this.queryService.getCategory(data));
  }
}
