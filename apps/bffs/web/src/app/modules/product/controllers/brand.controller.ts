import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetBrandRequestDto,
  GetManyBrandsRequestDto,
} from '@common/interfaces/dtos/product';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { BrandReadService } from '../services/brand-read.service';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandReadService: BrandReadService) {}

  @Get()
  @IsPublic()
  async getManyBrands(
    @Query() query: GetManyBrandsRequestDto,
    @ProcessId() processId: string
  ) {
    return this.brandReadService.getManyBrands({ ...query, processId });
  }

  @Get(':id')
  @IsPublic()
  async getBrandById(
    @Param() params: GetBrandRequestDto,
    @ProcessId() processId: string
  ) {
    return this.brandReadService.getBrand({ ...params, processId });
  }
}
