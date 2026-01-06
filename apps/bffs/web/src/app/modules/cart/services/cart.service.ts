import {
  AddCartItemRequest,
  CART_SERVICE_NAME,
  CART_SERVICE_PACKAGE_NAME,
  CartResponse,
  CartServiceClient,
  DeleteCartItemRequest,
  GetManyCartItemsRequest,
  GetManyCartItemsResponse,
  UpdateCartItemRequest,
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

  addCartItem(data: AddCartItemRequest): Promise<CartResponse> {
    return firstValueFrom(this.cartService.addCartItem(data));
  }

  updateCartItem(data: UpdateCartItemRequest): Promise<CartResponse> {
    return firstValueFrom(this.cartService.updateCartItem(data));
  }

  deleteCartItem(data: DeleteCartItemRequest): Promise<CartResponse> {
    return firstValueFrom(this.cartService.deleteCartItem(data));
  }
}
