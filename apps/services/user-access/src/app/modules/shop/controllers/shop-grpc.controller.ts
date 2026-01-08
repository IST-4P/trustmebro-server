import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateShopRequest,
  GetShopRequest,
  UpdateShopRequest,
  ValidateShopsRequest,
} from '@common/interfaces/models/user-access';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ShopService } from '../services/shop.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class ShopGrpcController {
  constructor(private readonly shopService: ShopService) {}

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'GetShop')
  getShop(data: GetShopRequest) {
    return this.shopService.find(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'CreateShop')
  createShop(data: CreateShopRequest) {
    return this.shopService.create(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'UpdateShop')
  updateShop(data: UpdateShopRequest) {
    return this.shopService.update(data);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'ValidateShops')
  validateShops(data: ValidateShopsRequest) {
    return this.shopService.validateShops(data);
  }
}
