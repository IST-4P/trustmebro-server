import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetManyProductsRequestDto,
  GetProductRequestDto,
} from '@common/interfaces/dtos/product';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductReadService } from '../services/product-read.service';

@Controller('product')
export class ProductController {
  constructor(private readonly productReadService: ProductReadService) {}

  @Get()
  @IsPublic()
  async getManyProducts(
    @Query() query: GetManyProductsRequestDto,
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
  @IsPublic()
  async getProductById(
    @Param() params: GetProductRequestDto,
    @ProcessId() processId: string
  ) {
    return this.productReadService.getProduct({ ...params, processId });
  }
}
