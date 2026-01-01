import {
  GetManyShipsFromRequest,
  GetManyShipsFromResponse,
  GetShipsFromRequest,
  GetShipsFromResponse,
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
} from '@common/interfaces/proto-types/query';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ShipsFromReadService implements OnModuleInit {
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
  }

  async getManyShipsFrom(
    data: GetManyShipsFromRequest
  ): Promise<GetManyShipsFromResponse> {
    return firstValueFrom(this.queryService.getManyShipsFrom(data));
  }

  async getShipsFrom(data: GetShipsFromRequest): Promise<GetShipsFromResponse> {
    return firstValueFrom(this.queryService.getShipsFrom(data));
  }
}
