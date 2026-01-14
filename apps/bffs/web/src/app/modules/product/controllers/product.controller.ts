import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetManyProductsRequestDto,
  GetManyProductsResponseDto,
  GetProductRequestDto,
  GetProductResponseDto,
} from '@common/interfaces/dtos/product';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { ProductReadService } from '../services/product-read.service';

class GetManyProductsBodyDto extends OmitType(GetManyProductsRequestDto, [
  'processId',
] as const) {}
class GetProductBodyDto extends OmitType(GetProductRequestDto, [
  'processId',
  'isHidden',
] as const) {}

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(private readonly productReadService: ProductReadService) {}

  @Get()
  @ApiOkResponse({ type: GetManyProductsResponseDto })
  @IsPublic()
  async getManyProducts(
    @Query() query: GetManyProductsBodyDto,
    @ProcessId() processId: string
  ) {
    return this.productReadService.getManyProducts({
      ...query,
      processId,
      brandIds: query.brandIds ?? [],
      categories: query.categories ?? [],
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetProductResponseDto })
  @IsPublic()
  async getProductById(
    @Param() params: GetProductBodyDto,
    @ProcessId() processId: string
  ) {
    return this.productReadService.getProduct({ ...params, processId });
  }
}
