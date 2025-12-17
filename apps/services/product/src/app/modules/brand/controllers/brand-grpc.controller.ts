import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateBrandRequest,
  DeleteBrandRequest,
  UpdateBrandRequest,
} from '@common/interfaces/models/product';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BrandService } from '../services/brand.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class BrandGrpcController {
  constructor(private readonly brandService: BrandService) {}

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'CreateBrand')
  createBrand(data: CreateBrandRequest) {
    return this.brandService.create(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'UpdateBrand')
  updateBrand(data: UpdateBrandRequest) {
    return this.brandService.update(data);
  }

  @GrpcMethod(GrpcServiceName.PRODUCT_SERVICE, 'DeleteBrand')
  deleteBrand(data: DeleteBrandRequest) {
    return this.brandService.delete(data);
  }
}
