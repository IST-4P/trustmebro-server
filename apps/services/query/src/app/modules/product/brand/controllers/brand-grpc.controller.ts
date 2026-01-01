import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  GetBrandRequest,
  GetManyBrandsRequest,
} from '@common/interfaces/models/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BrandService } from '../services/brand.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class BrandGrpcController {
  constructor(private readonly brandService: BrandService) {}

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetManyBrands')
  getManyBrands(data: GetManyBrandsRequest) {
    return this.brandService.list(data);
  }

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetBrand')
  getBrand(data: GetBrandRequest) {
    return this.brandService.findById(data);
  }
}
