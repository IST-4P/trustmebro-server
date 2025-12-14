import {
  CreateBrandRequest,
  DeleteBrandRequest,
  GetBrandRequest,
  GetBrandResponse,
  GetManyBrandsRequest,
  GetManyBrandsResponse,
  UpdateBrandRequest,
} from '@common/interfaces/models/product';
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { BrandService } from '../services/brand.service';

@Controller()
// @UseInterceptors(GrpcLoggingInterceptor)
export class BrandGrpcController {
  constructor(private readonly brandService: BrandService) {}

  @GrpcMethod('ProductService', 'GetManyBrands')
  getManyBrands(data: GetManyBrandsRequest): Promise<GetManyBrandsResponse> {
    return this.brandService.list(data);
  }

  @GrpcMethod('ProductService', 'GetBrand')
  getBrand(data: GetBrandRequest): Promise<GetBrandResponse | null> {
    return this.brandService.findById(data);
  }

  @GrpcMethod('ProductService', 'CreateBrand')
  createBrand(data: CreateBrandRequest): Promise<GetBrandResponse> {
    return this.brandService.create(data);
  }

  @GrpcMethod('ProductService', 'UpdateBrand')
  updateBrand(data: UpdateBrandRequest): Promise<GetBrandResponse> {
    return this.brandService.update(data);
  }

  @GrpcMethod('ProductService', 'DeleteBrand')
  deleteBrand(data: DeleteBrandRequest): Promise<GetBrandResponse> {
    return this.brandService.delete(data);
  }
}
