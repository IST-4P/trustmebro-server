import { RedisConfiguration } from '@common/configurations/redis.config';
import {
  CategoryResponse,
  GetCategoryRequest,
  GetManyCategoriesRequest,
  GetManyCategoriesResponse,
} from '@common/interfaces/models/product';
import { generateCategoryCacheKey } from '@common/utils/cache-key.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CategoryMapper } from '../mappers/category.mapper';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async list({
    processId,
    ...data
  }: GetManyCategoriesRequest): Promise<GetManyCategoriesResponse> {
    // Check cache
    const cacheKey = generateCategoryCacheKey(data.parentCategoryId ?? '');
    const cacheData = await this.cacheManager.get<GetManyCategoriesResponse>(
      cacheKey
    );
    if (cacheData) {
      return cacheData;
    }

    const categories = await this.categoryRepository.list(data);
    if (categories.length === 0) {
      throw new NotFoundException('Error.CategoryNotFound');
    }
    this.cacheManager.set(
      cacheKey,
      { categories },
      RedisConfiguration.CACHE_CATEGORY_TTL
    );
    return { categories };
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
