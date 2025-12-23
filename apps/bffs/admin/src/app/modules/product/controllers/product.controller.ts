import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import { CreateProductRequestDto } from '@common/interfaces/dtos/product';
import { Body, Controller, Post } from '@nestjs/common';
import { ProductWriteService } from '../services/product-write.service';

@Controller('product-admin')
export class ProductController {
  constructor(private readonly productWriteService: ProductWriteService) {}

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

  @Post()
  async createProduct(
    @Body() body: CreateProductRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.productWriteService.createProduct({
      ...body,
      processId,
      createdById: userId,
    });
  }

  // @Put()
  // async updateProduct(
  //   @Body() body: UpdateProductRequestDto,
  //   @ProcessId() processId: string,
  //   @UserData('userId') userId: string
  // ) {
  //   return this.productWriteService.updateProduct({
  //     ...body,
  //     processId,
  //     updatedById: userId,
  //   });
  // }

  // @Delete(':id')
  // async deleteProduct(
  //   @Param() params: DeleteProductRequestDto,
  //   @ProcessId() processId: string,
  //   @UserData('userId') userId: string
  // ) {
  //   return this.productWriteService.deleteProduct({
  //     ...params,
  //     processId,
  //     deletedById: userId,
  //   });
  // }
}
