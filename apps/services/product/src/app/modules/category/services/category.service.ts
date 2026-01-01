import { PrismaErrorValues } from '@common/constants/prisma.constant';
import { QueueTopics } from '@common/constants/queue.constant';
import {
  CreateCategoryRequest,
  DeleteCategoryRequest,
  UpdateCategoryRequest,
} from '@common/interfaces/models/product';
import { KafkaService } from '@common/kafka/kafka.service';
import { generateCategoryCacheKey } from '@common/utils/cache-key.util';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly kafkaService: KafkaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache
  ) {}

  async create({ processId, ...data }: CreateCategoryRequest) {
    try {
      const createdCategory = await this.categoryRepository.create(data);
      this.kafkaService.emit(
        QueueTopics.CATEGORY.CREATE_CATEGORY,
        createdCategory
      );
      this.cacheManager.del(
        generateCategoryCacheKey(createdCategory.parentCategoryId ?? '')
      );
      return createdCategory;
    } catch (error) {
      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new NotFoundException('Error.CategoryAlreadyExists');
      }
    }
  }

  async update({ processId, ...data }: UpdateCategoryRequest) {
    try {
      const updatedCategory = await this.categoryRepository.update(data);
      this.kafkaService.emit(
        QueueTopics.CATEGORY.UPDATE_CATEGORY,
        updatedCategory
      );
      this.cacheManager.del(
        generateCategoryCacheKey(updatedCategory.parentCategoryId ?? '')
      );
      return updatedCategory;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.CategoryNotFound');
      }
      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new NotFoundException('Error.CategoryAlreadyExists');
      }
      throw error;
    }
  }

  async delete({ processId, ...data }: DeleteCategoryRequest) {
    try {
      const deletedCategory = await this.categoryRepository.delete(data, false);
      this.kafkaService.emit(
        QueueTopics.CATEGORY.DELETE_CATEGORY,
        deletedCategory
      );
      this.cacheManager.del(
        generateCategoryCacheKey(deletedCategory.parentCategoryId ?? '')
      );
      return deletedCategory;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.CategoryNotFound');
      }
      throw error;
    }
  }
}
