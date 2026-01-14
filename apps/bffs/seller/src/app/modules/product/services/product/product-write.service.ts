import {
  CreateProductRequest,
  DeleteProductRequest,
  PRODUCT_SERVICE_NAME,
  PRODUCT_SERVICE_PACKAGE_NAME,
  ProductResponse,
  ProductServiceClient,
  UpdateProductRequest,
} from '@common/interfaces/proto-types/product';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ProductWriteService implements OnModuleInit {
  private productService!: ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE_PACKAGE_NAME)
    private productClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.productService =
      this.productClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  async createProduct(data: CreateProductRequest): Promise<ProductResponse> {
    return firstValueFrom(this.productService.createProduct(data));
  }

  async updateProduct(data: UpdateProductRequest): Promise<ProductResponse> {
    return firstValueFrom(this.productService.updateProduct(data));
  }

  async deleteProduct(data: DeleteProductRequest): Promise<ProductResponse> {
    return firstValueFrom(this.productService.deleteProduct(data));
  }
}
