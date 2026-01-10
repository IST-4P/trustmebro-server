import { QueueTopics } from '@common/constants/queue.constant';
import { OrderResponse } from '@common/interfaces/models/order';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderService } from '../services/order.service';

@Controller()
export class OrderConsumerController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern(QueueTopics.ORDER.CREATE_ORDER)
  createOrder(
    @Payload() payload: { order: OrderResponse & { shopName: string } }
  ) {
    return this.orderService.create(payload.order);
  }

  @EventPattern(QueueTopics.ORDER.CANCEL_ORDER)
  cancelOrder(@Payload() payload: { orderId: string }) {
    return this.orderService.cancel(payload);
  }
}
