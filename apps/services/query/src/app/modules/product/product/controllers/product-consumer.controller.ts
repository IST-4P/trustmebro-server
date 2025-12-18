import { QueueTopics } from '@common/constants/queue.constant';
import { ProductResponse } from '@common/interfaces/models/product';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ProductService } from '../services/product.service';

@Controller()
export class ProductConsumerController {
  constructor(private readonly productService: ProductService) {}

  @EventPattern(QueueTopics.PRODUCT.CREATE_PRODUCT)
  createProduct(@Payload() payload: ProductResponse) {
    return this.productService.create(payload);
  }

  @EventPattern(QueueTopics.PRODUCT.UPDATE_PRODUCT)
  updateProduct(@Payload() payload: ProductResponse) {
    return this.productService.update(payload);
  }

  @EventPattern(QueueTopics.PRODUCT.DELETE_PRODUCT)
  deleteProduct(@Payload() payload: ProductResponse) {
    return this.productService.delete(payload);
  }
}
