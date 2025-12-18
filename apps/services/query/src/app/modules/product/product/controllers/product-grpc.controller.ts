// import { GrpcServiceName } from '@common/constants/grpc.constant';
// import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
// import {
//   GetManyProductsRequest,
//   GetProductRequest,
// } from '@common/interfaces/models/product';
// import { Controller, UseInterceptors } from '@nestjs/common';
// import { GrpcMethod } from '@nestjs/microservices';
// import { ProductService } from '../services/product.service';

// @Controller()
// @UseInterceptors(GrpcLoggingInterceptor)
// export class ProductGrpcController {
//   constructor(private readonly brandService: ProductService) {}

//   @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetManyProducts')
//   getManyProducts(data: GetManyProductsRequest) {
//     return this.brandService.list(data);
//   }

//   @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetProduct')
//   getProduct(data: GetProductRequest) {
//     return this.brandService.findById(data);
//   }
// }
