import { QueueTopics } from '@common/constants/queue.constant';
import { CategoryResponse } from '@common/interfaces/models/product';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CategoryService } from '../services/category.service';

@Controller()
export class CategoryConsumerController {
  constructor(private readonly categoryService: CategoryService) {}

  @EventPattern(QueueTopics.CATEGORY.CREATE_CATEGORY)
  createCategory(@Payload() payload: CategoryResponse) {
    return this.categoryService.create(payload);
  }

  @EventPattern(QueueTopics.CATEGORY.UPDATE_CATEGORY)
  updateCategory(@Payload() payload: CategoryResponse) {
    return this.categoryService.update(payload);
  }

  @EventPattern(QueueTopics.CATEGORY.DELETE_CATEGORY)
  deleteCategory(@Payload() payload: CategoryResponse) {
    return this.categoryService.delete(payload);
  }
}
