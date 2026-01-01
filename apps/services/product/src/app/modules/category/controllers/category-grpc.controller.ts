import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CategoryResponse,
  CreateCategoryRequest,
  DeleteCategoryRequest,
  UpdateCategoryRequest,
} from '@common/interfaces/models/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CategoryService } from '../services/category.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class CategoryGrpcController {
  constructor(private readonly categoryService: CategoryService) {}

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'CreateCategory')
  createCategory(data: CreateCategoryRequest): Promise<CategoryResponse> {
    return this.categoryService.create(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'UpdateCategory')
  updateCategory(data: UpdateCategoryRequest): Promise<CategoryResponse> {
    return this.categoryService.update(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'DeleteCategory')
  deleteCategory(data: DeleteCategoryRequest): Promise<CategoryResponse> {
    return this.categoryService.delete(data);
  }
}
