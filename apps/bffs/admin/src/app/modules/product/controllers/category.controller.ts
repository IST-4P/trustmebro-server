import { IsPublic } from '@common/decorators/auth.decorator';
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
import { CategoryReadService } from '../services/category-read.service';
import { CategoryWriteService } from '../services/category-write.service';

@Controller('category-admin')
export class CategoryController {
  constructor(
    private readonly categoryReadService: CategoryReadService,
    private readonly categoryWriteService: CategoryWriteService
  ) {}

  @Get()
  async getManyCategories(
    @Query() query: GetManyCategoriesRequestDto,
    @ProcessId() processId: string
  ) {
    return this.categoryReadService.getManyCategories({ ...query, processId });
  }

  @Get(':id')
  async getCategoryById(
    @Param() params: GetCategoryRequestDto,
    @ProcessId() processId: string
  ) {
    return this.categoryReadService.getCategory({ ...params, processId });
  }

  @Post()
  @IsPublic()
  async createCategory(
    @Body() body: CreateCategoryRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.categoryWriteService.createCategory({
      ...body,
      processId,
      createdById: userId,
    });
  }

  @Put()
  async updateCategory(
    @Body() body: UpdateCategoryRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.categoryWriteService.updateCategory({
      ...body,
      processId,
      updatedById: userId,
    });
  }

  @Delete(':id')
  async deleteCategory(
    @Param() params: DeleteCategoryRequestDto,
    @ProcessId() processId: string,
    @UserData('userId') userId: string
  ) {
    return this.categoryWriteService.deleteCategory({
      ...params,
      processId,
      deletedById: userId,
    });
  }
}
