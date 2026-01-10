import {
  AddressResponse,
  CreateAddressRequest,
  DeleteAddressRequest,
  GetAddressRequest,
  GetManyAddressesRequest,
  GetManyAddressesResponse,
  UpdateAddressRequest,
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
} from '@common/interfaces/proto-types/user-access';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AddressService implements OnModuleInit {
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

  async getManyAddresses(
    data: GetManyAddressesRequest
  ): Promise<GetManyAddressesResponse> {
    return firstValueFrom(this.userAccessService.getManyAddresses(data));
  }

  async getAddress(data: GetAddressRequest): Promise<AddressResponse> {
    return firstValueFrom(this.userAccessService.getAddress(data));
  }

  async createAddress(data: CreateAddressRequest): Promise<AddressResponse> {
    return firstValueFrom(this.userAccessService.createAddress(data));
  }

  async updateAddress(data: UpdateAddressRequest): Promise<AddressResponse> {
    return firstValueFrom(this.userAccessService.updateAddress(data));
  }

  async deleteAddress(data: DeleteAddressRequest): Promise<AddressResponse> {
    return firstValueFrom(this.userAccessService.deleteAddress(data));
  }
}
