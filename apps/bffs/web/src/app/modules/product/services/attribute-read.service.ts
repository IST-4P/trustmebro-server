import {
  GetAttributeRequest,
  GetAttributeResponse,
  GetManyAttributesRequest,
  GetManyAttributesResponse,
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
} from '@common/interfaces/proto-types/query';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AttributeReadService implements OnModuleInit {
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
  }

  async getManyAttributes(
    data: GetManyAttributesRequest
  ): Promise<GetManyAttributesResponse> {
    return firstValueFrom(this.queryService.getManyAttributes(data));
  }

  async getAttribute(data: GetAttributeRequest): Promise<GetAttributeResponse> {
    return firstValueFrom(this.queryService.getAttribute(data));
  }
}
