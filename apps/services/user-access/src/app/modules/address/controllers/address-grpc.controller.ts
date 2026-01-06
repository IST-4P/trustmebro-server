import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateAddressRequest,
  DeleteAddressRequest,
  UpdateAddressRequest,
} from '@common/interfaces/models/user-access';
import { Body, Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { AddressService } from '../services/address.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class AddressGrpcController {
  constructor(private readonly shopService: AddressService) {}

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'CreateAddress')
  createAddress(@Body() body: CreateAddressRequest) {
    return this.shopService.create(body);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'UpdateAddress')
  updateAddress(@Body() body: UpdateAddressRequest) {
    return this.shopService.update(body);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'DeleteAddress')
  deleteAddress(@Body() body: DeleteAddressRequest) {
    return this.shopService.delete(body);
  }
}
