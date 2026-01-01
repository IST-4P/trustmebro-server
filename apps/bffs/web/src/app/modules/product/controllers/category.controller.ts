import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetCategoryRequestDto,
  GetManyCategoriesRequestDto,
} from '@common/interfaces/dtos/product';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { CategoryReadService } from '../services/category-read.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryReadService: CategoryReadService) {}

  @Get()
  @IsPublic()
  async getManyCategories(
    @Query() query: GetManyCategoriesRequestDto,
    @ProcessId() processId: string
  ) {
    return this.categoryReadService.getManyCategories({ ...query, processId });
  }

  @Get(':id')
  @IsPublic()
  async getCategoryById(
    @Param() params: GetCategoryRequestDto,
    @ProcessId() processId: string
  ) {
    return this.categoryReadService.getCategory({ ...params, processId });
  }
}
