import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetBrandRequestDto,
  GetBrandResponseDto,
  GetManyBrandsRequestDto,
  GetManyBrandsResponseDto,
} from '@common/interfaces/dtos/product';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { BrandReadService } from '../services/brand-read.service';

class GetManyBrandsBodyDto extends OmitType(GetManyBrandsRequestDto, [
  'processId',
] as const) {}

class GetBrandBodyDto extends OmitType(GetBrandRequestDto, [
  'processId',
] as const) {}

@Controller('brand')
@ApiTags('Product')
export class BrandController {
  constructor(private readonly brandReadService: BrandReadService) {}

  @Get()
  @ApiOkResponse({ type: GetManyBrandsResponseDto })
  @IsPublic()
  async getManyBrands(
    @Query() queries: GetManyBrandsBodyDto,
    @ProcessId() processId: string
  ) {
    return this.brandReadService.getManyBrands({ ...queries, processId });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetBrandResponseDto })
  @IsPublic()
  async getBrand(
    @Param() params: GetBrandBodyDto,
    @ProcessId() processId: string
  ) {
    return this.brandReadService.getBrand({ ...params, processId });
  }
}
