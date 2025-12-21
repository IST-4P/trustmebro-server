import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { AddCartItemRequest } from '@common/interfaces/models/cart';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CartItemService } from '../services/cart-item.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class CartGrpcController {
  constructor(private readonly cartItemService: CartItemService) {}

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'AddCartItem')
  createCart(data: AddCartItemRequest) {
    return this.cartItemService.add(data);
  }
}
