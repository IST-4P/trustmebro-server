import {
  CreateShipsFromRequest,
  DeleteShipsFromRequest,
  PRODUCT_SERVICE_NAME,
  PRODUCT_SERVICE_PACKAGE_NAME,
  ProductServiceClient,
  ShipsFromResponse,
  UpdateShipsFromRequest,
} from '@common/interfaces/proto-types/product';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ShipsFromWriteService implements OnModuleInit {
  private productService!: ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE_PACKAGE_NAME)
    private productClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.productService =
      this.productClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  async createShipsFrom(
    data: CreateShipsFromRequest
  ): Promise<ShipsFromResponse> {
    return firstValueFrom(this.productService.createShipsFrom(data));
  }

  async updateShipsFrom(
    data: UpdateShipsFromRequest
  ): Promise<ShipsFromResponse> {
    return firstValueFrom(this.productService.updateShipsFrom(data));
  }

  async deleteShipsFrom(
    data: DeleteShipsFromRequest
  ): Promise<ShipsFromResponse> {
    return firstValueFrom(this.productService.deleteShipsFrom(data));
  }
}
