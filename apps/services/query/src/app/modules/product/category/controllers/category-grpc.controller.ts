import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  GetCategoryRequest,
  GetCategoryResponse,
  GetManyCategoriesRequest,
  GetManyCategoriesResponse,
} from '@common/interfaces/models/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CategoryService } from '../services/category.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class CategoryGrpcController {
  constructor(private readonly categoryService: CategoryService) {}

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetManyCategories')
  getManyCategories(
    data: GetManyCategoriesRequest
  ): Promise<GetManyCategoriesResponse> {
    return this.categoryService.list(data);
  }

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetCategory')
  getCategory(data: GetCategoryRequest): Promise<GetCategoryResponse | null> {
    return this.categoryService.findById(data);
  }
}
