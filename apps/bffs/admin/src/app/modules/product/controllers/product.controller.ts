import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateProductRequestDto,
  DeleteProductRequestDto,
  GetManyProductsRequestDto,
  GetProductRequestDto,
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
import { ProductReadService } from '../services/product/product-read.service';
import { ProductWriteService } from '../services/product/product-write.service';

@Controller('product-admin')
export class ProductController {
  constructor(
    private readonly productWriteService: ProductWriteService,
    private readonly productReadService: ProductReadService
  ) {}

  @Get()
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
  async getProductById(
    @Param() params: GetProductRequestDto,
    @ProcessId() processId: string
  ) {
    return this.productReadService.getProduct({ ...params, processId });
  }

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

  @Put()
  async updateProduct(
    @Body() body: UpdateProductRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.productWriteService.updateProduct({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  async deleteProduct(
    @Param() params: DeleteProductRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.productWriteService.deleteProduct({
      ...params,
      processId,
      deletedById: userId,
    });
  }
}
