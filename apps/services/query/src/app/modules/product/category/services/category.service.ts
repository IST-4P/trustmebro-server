import {
  CategoryResponse,
  GetCategoryRequest,
  GetManyCategoriesRequest,
} from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async list(data: GetManyCategoriesRequest) {
    const categories = await this.categoryRepository.list(data);
    if (categories.totalItems === 0) {
      throw new NotFoundException('Error.CategoryNotFound');
    }
    return categories;
  }

  async findById(data: GetCategoryRequest) {
    const category = await this.categoryRepository.findById(data.id);
    if (!category) {
      throw new NotFoundException('Error.CategoryNotFound');
    }
    return category;
  }

  create(data: CategoryResponse) {
    return this.categoryRepository.create(CategoryMapper(data));
  }

  update(data: CategoryResponse) {
    return this.categoryRepository.update(CategoryMapper(data));
  }

  delete(data: CategoryResponse) {
    return this.categoryRepository.delete({ id: data.id });
  }
}
