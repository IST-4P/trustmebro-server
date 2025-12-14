import {
  CategoryResponse,
  CreateCategoryRequest,
  DeleteCategoryRequest,
  GetCategoryRequest,
  GetManyCategoriesRequest,
  GetManyCategoriesResponse,
  PRODUCT_SERVICE_NAME,
  PRODUCT_SERVICE_PACKAGE_NAME,
  ProductServiceClient,
  UpdateCategoryRequest,
} from '@common/interfaces/proto-types/product';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class CategoryService implements OnModuleInit {
  private productService!: ProductServiceClient;

  constructor(
    @Inject(PRODUCT_SERVICE_PACKAGE_NAME)
    private productClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.productService =
      this.productClient.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  async getManyCategories(
    data: GetManyCategoriesRequest
  ): Promise<GetManyCategoriesResponse> {
    return firstValueFrom(this.productService.getManyCategories(data));
  }

  async getCategory(data: GetCategoryRequest): Promise<CategoryResponse> {
    return firstValueFrom(this.productService.getCategory(data));
  }

  async createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
    return firstValueFrom(this.productService.createCategory(data));
  }

  async updateCategory(data: UpdateCategoryRequest): Promise<CategoryResponse> {
    return firstValueFrom(this.productService.updateCategory(data));
  }

  async deleteCategory(data: DeleteCategoryRequest): Promise<CategoryResponse> {
    return firstValueFrom(this.productService.deleteCategory(data));
  }
}
