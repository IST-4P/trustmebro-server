import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateCategoryAttributeRequest,
  DeleteCategoryAttributeRequest,
  GetCategoryAttributeRequest,
  GetCategoryAttributeResponse,
  GetManyCategoryAttributesRequest,
  GetManyCategoryAttributesResponse,
  UpdateCategoryAttributeRequest,
} from '@common/interfaces/models/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CategoryAttributeService } from '../services/category-attribute.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class CategoryAttributeGrpcController {
  constructor(
    private readonly categoryAttributeService: CategoryAttributeService
  ) {}

  @GrpcMethod('ProductService', 'GetManyCategoryAttributes')
  getManyCategoryAttributes(
    data: GetManyCategoryAttributesRequest
  ): Promise<GetManyCategoryAttributesResponse> {
    return this.categoryAttributeService.list(data);
  }

  @GrpcMethod('ProductService', 'GetCategoryAttribute')
  getCategoryAttribute(
    data: GetCategoryAttributeRequest
  ): Promise<GetCategoryAttributeResponse | null> {
    return this.categoryAttributeService.findById(data);
  }

  @GrpcMethod('ProductService', 'CreateCategoryAttribute')
  createCategoryAttribute(
    data: CreateCategoryAttributeRequest
  ): Promise<GetCategoryAttributeResponse> {
    return this.categoryAttributeService.create(data);
  }

  @GrpcMethod('ProductService', 'UpdateCategoryAttribute')
  updateCategoryAttribute(
    data: UpdateCategoryAttributeRequest
  ): Promise<GetCategoryAttributeResponse> {
    return this.categoryAttributeService.update(data);
  }

  @GrpcMethod('ProductService', 'DeleteCategoryAttribute')
  deleteCategoryAttribute(
    data: DeleteCategoryAttributeRequest
  ): Promise<GetCategoryAttributeResponse> {
    return this.categoryAttributeService.delete(data);
  }
}
