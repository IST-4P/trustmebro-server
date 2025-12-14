import {
  CreateCategoryRequest,
  DeleteCategoryRequest,
  GetCategoryRequest,
  GetCategoryResponse,
  GetManyCategoriesRequest,
  GetManyCategoriesResponse,
  UpdateCategoryRequest,
} from '@common/interfaces/models/product';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CategoryService } from '../services/category.service';

@Controller()
// @UseInterceptors(GrpcLoggingInterceptor)
export class CategoryGrpcController {
  constructor(private readonly categoryService: CategoryService) {}

  @GrpcMethod('ProductService', 'GetManyCategories')
  getManyCategories(
    data: GetManyCategoriesRequest
  ): Promise<GetManyCategoriesResponse> {
    return this.categoryService.list(data);
  }

  @GrpcMethod('ProductService', 'GetCategory')
  getCategory(data: GetCategoryRequest): Promise<GetCategoryResponse | null> {
    return this.categoryService.findById(data);
  }

  @GrpcMethod('ProductService', 'CreateCategory')
  createCategory(data: CreateCategoryRequest): Promise<GetCategoryResponse> {
    return this.categoryService.create(data);
  }

  @GrpcMethod('ProductService', 'UpdateCategory')
  updateCategory(data: UpdateCategoryRequest): Promise<GetCategoryResponse> {
    return this.categoryService.update(data);
  }

  @GrpcMethod('ProductService', 'DeleteCategory')
  deleteCategory(data: DeleteCategoryRequest): Promise<GetCategoryResponse> {
    return this.categoryService.delete(data);
  }
}
