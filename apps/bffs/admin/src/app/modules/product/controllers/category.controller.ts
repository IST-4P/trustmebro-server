import { ProcessId } from '@common/decorators/process-id.decorator';
import { UserData } from '@common/decorators/user-data.decorator';
import {
  CreateCategoryRequestDto,
  DeleteCategoryRequestDto,
  GetCategoryRequestDto,
  GetManyCategoriesRequestDto,
  UpdateCategoryRequestDto,
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
import { CategoryService } from '../services/category.service';

@Controller('category-admin')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getManyCategories(
    @Query() query: GetManyCategoriesRequestDto,
    @ProcessId() processId: string
  ) {
    return this.categoryService.getManyCategories({ ...query, processId });
  }

  @Get(':id')
  async getCategoryById(
    @Param() params: GetCategoryRequestDto,
    @ProcessId() processId: string
  ) {
    return this.categoryService.getCategory({ ...params, processId });
  }

  @Post()
  async createCategory(
    @Body() body: CreateCategoryRequestDto,
    @ProcessId() processId: string,
    @UserData('id') userId: string
  ) {
    return this.categoryService.createCategory({
      ...body,
      processId,
      createdById: userId,
    });
  }

  @Put()
  async updateCategory(
    @Body() body: UpdateCategoryRequestDto,
    @ProcessId() processId: string,
    @UserData('id') userId: string
  ) {
    return this.categoryService.updateCategory({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  async deleteCategory(
    @Param() params: DeleteCategoryRequestDto,
    @ProcessId() processId: string,
    @UserData('id') userId: string
  ) {
    return this.categoryService.deleteCategory({
      ...params,
      processId,
      deletedById: userId,
    });
  }
}
