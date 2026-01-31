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
  'isApproved',
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
    @Query() queries: GetManyProductsBodyDto,
    @ProcessId() processId: string
  ) {
    let categoryIds: string[] = [];

    if (Array.isArray(queries.categories)) {
      categoryIds = queries.categories;
    } else if (typeof queries.categories === 'string') {
      categoryIds = [queries.categories];
    }

    // categoryIds.push('');
    return this.productReadService.getManyProducts({
      ...queries,
      processId,
      brandIds: queries.brandIds ?? [],
      categories: categoryIds,
      isApproved: true,
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
