import { Controller } from '@nestjs/common';

@Controller('product')
export class ProductController {
  constructor() {}

  // @Get()
  // async getManyProducts(
  //   @Query() query: GetManyProductsRequestDto,
  //   @ProcessId() processId: string
  // ) {
  //   return this.productReadService.getManyProducts({ ...query, processId });
  // }

  // @Get(':id')
  // async getProductById(
  //   @Param() params: GetProductRequestDto,
  //   @ProcessId() processId: string
  // ) {
  //   return this.productReadService.getProduct({ ...params, processId });
  // }
}
