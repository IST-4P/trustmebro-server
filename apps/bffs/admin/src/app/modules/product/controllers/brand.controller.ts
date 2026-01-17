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
import { ApiTags } from '@nestjs/swagger';
import { BrandReadService } from '../services/brand/brand-read.service';
import { BrandWriteService } from '../services/brand/brand-write.service';

@Controller('brand')
@ApiTags('Product')
export class BrandController {
  constructor(
    private readonly brandWriteService: BrandWriteService,
    private readonly brandReadService: BrandReadService
  ) {}

  @Get()
  async getManyBrands(
    @Query() queries: GetManyBrandsRequestDto,
    @ProcessId() processId: string
  ) {
    return this.brandReadService.getManyBrands({ ...queries, processId });
  }

  @Get(':id')
  async getBrandById(
    @Param() params: GetBrandRequestDto,
    @ProcessId() processId: string
  ) {
    return this.brandReadService.getBrand({ ...params, processId });
  }

  @Post()
  async createBrand(
    @Body() body: CreateBrandRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.brandWriteService.createBrand({
      ...body,
      processId,
      createdById: userId,
    });
  }

  @Put()
  async updateBrand(
    @Body() body: UpdateBrandRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.brandWriteService.updateBrand({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  async deleteBrand(
    @Param() params: DeleteBrandRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.brandWriteService.deleteBrand({
      ...params,
      processId,
      deletedById: userId,
    });
  }
}
