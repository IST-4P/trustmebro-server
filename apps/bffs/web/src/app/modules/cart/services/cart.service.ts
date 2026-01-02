import {
  AddCartItemRequest,
  AddCartItemResponse,
  CART_SERVICE_NAME,
  CART_SERVICE_PACKAGE_NAME,
  CartServiceClient,
  GetManyCartItemsRequest,
  GetManyCartItemsResponse,
} from '@common/interfaces/proto-types/cart';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CartService implements OnModuleInit {
  private cartService!: CartServiceClient;

  constructor(
    @Inject(CART_SERVICE_PACKAGE_NAME)
    private cartClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.cartService =
      this.cartClient.getService<CartServiceClient>(CART_SERVICE_NAME);
  }

  getManyCartItems(
    data: GetManyCartItemsRequest
  ): Promise<GetManyCartItemsResponse> {
    return firstValueFrom(this.cartService.getManyCartItems(data));
  }

  addCartItem(data: AddCartItemRequest): Promise<AddCartItemResponse> {
    return firstValueFrom(this.cartService.addCartItem(data));
  }
}
