import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  AddCartItemRequest,
  ValidateCartItemsRequest,
} from '@common/interfaces/models/cart';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CartItemService } from '../services/cart-item.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class CartGrpcController {
  constructor(private readonly cartItemService: CartItemService) {}

  @GrpcMethod(GrpcServiceName.CART_SERVICE, 'AddCartItem')
  createCart(data: AddCartItemRequest) {
    return this.cartItemService.add(data);
  }

  @GrpcMethod(GrpcServiceName.CART_SERVICE, 'ValidateCartItems')
  validateCartItems(data: ValidateCartItemsRequest) {
    return this.cartItemService.validateCartItems(data);
  }
}
