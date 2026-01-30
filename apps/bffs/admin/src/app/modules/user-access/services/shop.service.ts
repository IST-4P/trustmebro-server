import {
  GetManyShopsRequest,
  GetManyShopsResponse,
  GetShopRequest,
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
} from '@common/interfaces/proto-types/user-access';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ShopService implements OnModuleInit {
  private userAccessService!: UserAccessServiceClient;

  constructor(
    @Inject(USER_ACCESS_SERVICE_PACKAGE_NAME)
    private userAccessClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.userAccessService =
      this.userAccessClient.getService<UserAccessServiceClient>(
        USER_ACCESS_SERVICE_NAME
      );
  }

  async getShop(data: GetShopRequest) {
    return firstValueFrom(this.userAccessService.getShop(data));
  }

  async getManyShops(data: GetManyShopsRequest): Promise<GetManyShopsResponse> {
    return firstValueFrom(this.userAccessService.getManyShops(data));
  }
}
