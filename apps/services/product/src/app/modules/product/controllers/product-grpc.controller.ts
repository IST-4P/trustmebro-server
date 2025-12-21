import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { CreateProductRequest } from '@common/interfaces/models/product';
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
}
