import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateProductRequestDto,
  DeleteProductRequestDto,
  GetManyProductsRequestDto,
  GetManyProductsResponseDto,
  GetProductRequestDto,
  GetProductResponseDto,
  UpdateProductRequestDto,
} from '@common/interfaces/dtos/product';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { ProductReadService } from '../services/product/product-read.service';
import { ProductWriteService } from '../services/product/product-write.service';

class GetManyProductsBodyDto extends OmitType(GetManyProductsRequestDto, [
  'processId',
  'shopId',
] as const) {}
class GetProductBodyDto extends OmitType(GetProductRequestDto, [
  'processId',
  'isHidden',
] as const) {}
class CreateProductBodyDto extends OmitType(CreateProductRequestDto, [
  'processId',
  'createdById',
  'shopId',
] as const) {}
class UpdateProductBodyDto extends OmitType(UpdateProductRequestDto, [
  'processId',
  'updatedById',
  'shopId',
] as const) {}
class DeleteProductBodyDto extends OmitType(DeleteProductRequestDto, [
  'processId',
  'deletedById',
  'shopId',
] as const) {}

@Controller('product')
@ApiTags('Product')
export class ProductController {
  constructor(
    private readonly productWriteService: ProductWriteService,
    private readonly productReadService: ProductReadService
  ) {}

  @Get()
  @ApiOkResponse({ type: GetManyProductsResponseDto })
  async getManyProducts(
    @Query() query: GetManyProductsBodyDto,
    @ProcessId() processId: string,
    @UserData('shopId') shopId: string
  ) {
    return this.productReadService.getManyProducts({
      ...query,
      shopId,
      processId,
      brandIds: query.brandIds ?? [],
      categories: query.categories ?? [],
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetProductResponseDto })
  async getProductById(
    @Param() params: GetProductBodyDto,
    @ProcessId() processId: string,
    @UserData('shopId') shopId: string
  ) {
    return this.productReadService.getProduct({ ...params, processId, shopId });
  }

  @Post()
  async createProduct(
    @Body() body: CreateProductBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string,
    @UserData('shopId') shopId: string
  ) {
    return this.productWriteService.createProduct({
      ...body,
      processId,
      createdById: userId,
      shopId,
    });
  }

  @Put()
  async updateProduct(
    @Body() body: UpdateProductBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string,
    @UserData('shopId') shopId: string
  ) {
    return this.productWriteService.updateProduct({
      ...body,
      processId,
      shopId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  async deleteProduct(
    @Param() params: DeleteProductBodyDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string,
    @UserData('shopId') shopId: string
  ) {
    return this.productWriteService.deleteProduct({
      ...params,
      shopId,
      processId,
      deletedById: userId,
    });
  }
}
