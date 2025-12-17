import { QueueTopics } from '@common/constants/queue.constant';
import {
  CreateCategoryRequest,
  DeleteCategoryRequest,
  UpdateCategoryRequest,
} from '@common/interfaces/models/product';
import { KafkaService } from '@common/kafka/kafka.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoryRepository } from '../repositories/category.repository';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly kafkaService: KafkaService
  ) {}

  async create({ processId, ...data }: CreateCategoryRequest) {
    const category = await this.categoryRepository.create(data);
    this.kafkaService.emit(QueueTopics.CATEGORY.CREATE_CATEGORY, category);
    return category;
  }

  async update({ processId, ...data }: UpdateCategoryRequest) {
    try {
      const updatedCategory = await this.categoryRepository.update(data);
      this.kafkaService.emit(
        QueueTopics.CATEGORY.UPDATE_CATEGORY,
        updatedCategory
      );
      return updatedCategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Error.CategoryNotFound');
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
      return deletedCategory;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Error.CategoryNotFound');
      }
      throw error;
    }
  }
}
