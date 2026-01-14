import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateProductRequest,
  DeleteProductRequest,
  UpdateProductRequest,
  ValidateProductsRequest,
} from '@common/interfaces/models/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ProductService } from '../services/product.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class ProductGrpcController {
  constructor(private readonly productService: ProductService) {}

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'CreateProduct')
  createProduct(data: CreateProductRequest) {
    return this.productService.create(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'UpdateProduct')
  updateProduct(data: UpdateProductRequest) {
    return this.productService.update(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'DeleteProduct')
  deleteProduct(data: DeleteProductRequest) {
    return this.productService.delete(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'ValidateProducts')
  validateProducts(data: ValidateProductsRequest) {
    return this.productService.validateProducts(data);
  }
}
