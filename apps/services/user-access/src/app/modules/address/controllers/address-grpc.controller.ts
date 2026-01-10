import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateAddressRequest,
  DeleteAddressRequest,
  GetAddressRequest,
  GetManyAddressesRequest,
  UpdateAddressRequest,
} from '@common/interfaces/models/user-access';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AddressService } from '../services/address.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class AddressGrpcController {
  constructor(private readonly addressService: AddressService) {}

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'GetManyAddresses')
  getManyAddresses(data: GetManyAddressesRequest) {
    return this.addressService.list(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'GetAddress')
  getAddress(data: GetAddressRequest) {
    return this.addressService.findById(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'CreateAddress')
  createAddress(data: CreateAddressRequest) {
    return this.addressService.create(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'UpdateAddress')
  updateAddress(data: UpdateAddressRequest) {
    return this.addressService.update(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'DeleteAddress')
  deleteAddress(data: DeleteAddressRequest) {
    return this.addressService.delete(data);
  }
}
