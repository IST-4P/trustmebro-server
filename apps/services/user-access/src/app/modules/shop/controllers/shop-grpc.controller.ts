import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateShopRequest,
  GetShopRequest,
  UpdateShopRequest,
} from '@common/interfaces/models/user-access';
import { Body, Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ShopService } from '../services/shop.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class ShopGrpcController {
  constructor(private readonly shopService: ShopService) {}

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'GetShop')
  getShop(@Body() body: GetShopRequest) {
    return this.shopService.find(body);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'CreateShop')
  createShop(@Body() body: CreateShopRequest) {
    return this.shopService.create(body);
  }

  @GrpcMethod(GrpcServiceName.USER_ACCESS_SERVICE, 'UpdateShop')
  updateShop(@Body() body: UpdateShopRequest) {
    return this.shopService.update(body);
  }
}
