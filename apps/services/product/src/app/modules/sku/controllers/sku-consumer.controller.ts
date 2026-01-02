import { QueueTopics } from '@common/constants/queue.constant';
import { OrderItemResponse } from '@common/interfaces/models/order';
import { IncreaseStockRequest } from '@common/interfaces/models/product';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { SKUService } from '../services/sku.service';

@Controller()
export class SKUConsumerController {
  constructor(private readonly sKUService: SKUService) {}

  @EventPattern(QueueTopics.ORDER.CREATE_ORDER)
  decreaseStock(
    @Payload() payload: { items: OrderItemResponse[]; userId: string }
  ) {
    return this.sKUService.decreaseStock(payload);
  }

  @EventPattern(QueueTopics.ORDER.CANCEL_ORDER)
  increaseStock(@Payload() payload: IncreaseStockRequest) {
    return this.sKUService.increaseStock(payload);
  }
}
