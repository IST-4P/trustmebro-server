import {
  BrandResponse,
  CreateBrandRequest,
  DeleteBrandRequest,
  GetBrandRequest,
  GetManyBrandsRequest,
  GetManyBrandsResponse,
  PRODUCT_SERVICE_NAME,
  PRODUCT_SERVICE_PACKAGE_NAME,
  ProductServiceClient,
  UpdateBrandRequest,
} from '@common/interfaces/proto-types/product';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class BrandService implements OnModuleInit {
  private productService!: ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE_PACKAGE_NAME)
    private productClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.productService =
      this.productClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  async getManyBrands(
    data: GetManyBrandsRequest
  ): Promise<GetManyBrandsResponse> {
    return firstValueFrom(this.productService.getManyBrands(data));
  }

  async getBrand(data: GetBrandRequest): Promise<BrandResponse> {
    return firstValueFrom(this.productService.getBrand(data));
  }

  async createBrand(data: CreateBrandRequest): Promise<BrandResponse> {
    return firstValueFrom(this.productService.createBrand(data));
  }

  async updateBrand(data: UpdateBrandRequest): Promise<BrandResponse> {
    return firstValueFrom(this.productService.updateBrand(data));
  }

  async deleteBrand(data: DeleteBrandRequest): Promise<BrandResponse> {
    return firstValueFrom(this.productService.deleteBrand(data));
  }
}
