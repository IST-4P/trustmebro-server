import {
  AttributeResponse,
  CreateAttributeRequest,
  DeleteAttributeRequest,
  PRODUCT_SERVICE_NAME,
  PRODUCT_SERVICE_PACKAGE_NAME,
  ProductServiceClient,
  UpdateAttributeRequest,
} from '@common/interfaces/proto-types/product';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AttributeWriteService implements OnModuleInit {
  private productService!: ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE_PACKAGE_NAME)
    private productClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.productService =
      this.productClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  async createAttribute(
    data: CreateAttributeRequest
  ): Promise<AttributeResponse> {
    return firstValueFrom(this.productService.createAttribute(data));
  }

  async updateAttribute(
    data: UpdateAttributeRequest
  ): Promise<AttributeResponse> {
    return firstValueFrom(this.productService.updateAttribute(data));
  }

  async deleteAttribute(
    data: DeleteAttributeRequest
  ): Promise<AttributeResponse> {
    return firstValueFrom(this.productService.deleteAttribute(data));
  }
}
