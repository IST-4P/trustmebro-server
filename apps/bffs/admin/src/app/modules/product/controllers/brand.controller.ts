import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateBrandRequestDto,
  DeleteBrandRequestDto,
  GetBrandRequestDto,
  GetManyBrandsRequestDto,
  UpdateBrandRequestDto,
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
import { BrandService } from '../services/brand.service';

@Controller('brand-admin')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async getManyBrands(
    @Query() query: GetManyBrandsRequestDto,
    @ProcessId() processId: string
  ) {
    return this.brandService.getManyBrands({ ...query, processId });
  }

  @Get(':id')
  async getBrandById(
    @Param() params: GetBrandRequestDto,
    @ProcessId() processId: string
  ) {
    return this.brandService.getBrand({ ...params, processId });
  }

  @Post()
  async createBrand(
    @Body() body: CreateBrandRequestDto,
    @ProcessId() processId: string,
    @UserData('id') userId: string
  ) {
    return this.brandService.createBrand({
      ...body,
      processId,
      createdById: userId,
    });
  }

  @Put()
  async updateBrand(
    @Body() body: UpdateBrandRequestDto,
    @ProcessId() processId: string,
    @UserData('id') userId: string
  ) {
    return this.brandService.updateBrand({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  async deleteBrand(
    @Param() params: DeleteBrandRequestDto,
    @ProcessId() processId: string,
    @UserData('id') userId: string
  ) {
    return this.brandService.deleteBrand({
      ...params,
      processId,
      deletedById: userId,
    });
  }
}
