import {
  CreateProductRequest,
  GetManyProductsRequest,
  GetProductRequest,
} from '@common/interfaces/models/product';
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service';

@Controller('product')
// @UseInterceptors(GrpcLoggingInterceptor)
export class ProductGrpcController {
  constructor(private readonly productService: ProductService) {}

  // @GrpcMethod('ProductService', 'GetManyProducts')
  // getManyProducts(data: GetManyProductsRequest) {
  //   return this.productService.list(data);
  // }

  // @GrpcMethod('ProductService', 'GetProduct')
  // getProduct(data: GetProductRequest) {
  //   return this.productService.findById(data);
  // }

  // @GrpcMethod('ProductService', 'CreateProduct')
  // createProduct(data: CreateProductRequest) {
  //   return this.productService.create(data);
  // }

  @Get()
  getManyProducts(@Query() queries: GetManyProductsRequest) {
    return this.productService.list(queries);
  }

  @Get(':id')
  getProduct(@Param() params: GetProductRequest) {
    return this.productService.findById(params);
  }

  @Post()
  createProduct(@Body() data: CreateProductRequest) {
    return this.productService.create(data);
  }
}
