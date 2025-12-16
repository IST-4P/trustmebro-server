import {
  CreateCategoryRequest,
  DeleteCategoryRequest,
  GetCategoryRequest,
  GetManyCategoriesRequest,
  UpdateCategoryRequest,
} from '@common/interfaces/models/product';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async list(data: GetManyCategoriesRequest) {
    const brands = await this.categoryRepository.list(data);
    if (brands.totalItems === 0) {
      throw new NotFoundException('Error.CategoryNotFound');
    }
    return brands;
  }

  async findById(data: GetCategoryRequest) {
    const brand = await this.categoryRepository.findById(data.id);
    if (!brand) {
      throw new NotFoundException('Error.CategoryNotFound');
    }
    return brand;
  }

  async create({ processId, ...data }: CreateCategoryRequest) {
    return this.categoryRepository.create(data);
  }

  async update(data: UpdateCategoryRequest) {
    const brand = await this.categoryRepository.findById(data.id);
    if (!brand) {
      throw new NotFoundException('Error.CategoryNotFound');
    }
    return this.categoryRepository.update(data);
  }

  async delete(data: DeleteCategoryRequest) {
    const brand = await this.categoryRepository.findById(data.id);
    if (!brand) {
      throw new NotFoundException('Error.CategoryNotFound');
    }
    return this.categoryRepository.delete(data, false);
  }
}
