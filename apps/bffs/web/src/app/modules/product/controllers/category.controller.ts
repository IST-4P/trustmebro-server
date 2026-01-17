import { IsPublic } from '@common/decorators/auth.decorator';
import { ProcessId } from '@common/decorators/process-id.decorator';
import {
  GetCategoryRequestDto,
  GetCategoryResponseDto,
  GetManyCategoriesRequestDto,
  GetManyCategoriesResponseDto,
} from '@common/interfaces/dtos/product';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOkResponse, ApiTags, OmitType } from '@nestjs/swagger';
import { CategoryReadService } from '../services/category-read.service';

class GetManyCategoriesBodyDto extends OmitType(GetManyCategoriesRequestDto, [
  'processId',
] as const) {}
class GetCategoryBodyDto extends OmitType(GetCategoryRequestDto, [
  'processId',
] as const) {}

@Controller('category')
@ApiTags('Product')
export class CategoryController {
  constructor(private readonly categoryReadService: CategoryReadService) {}

  @Get()
  @ApiOkResponse({ type: GetManyCategoriesResponseDto })
  @IsPublic()
  async getManyCategories(
    @Query() queries: GetManyCategoriesBodyDto,
    @ProcessId() processId: string
  ) {
    return this.categoryReadService.getManyCategories({
      ...queries,
      processId,
    });
  }

  @Get(':id')
  @ApiOkResponse({ type: GetCategoryResponseDto })
  @IsPublic()
  async getCategoryById(
    @Param() params: GetCategoryBodyDto,
    @ProcessId() processId: string
  ) {
    return this.categoryReadService.getCategory({ ...params, processId });
  }
}
