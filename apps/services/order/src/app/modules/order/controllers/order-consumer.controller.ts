import { QueueTopics } from '@common/constants/queue.constant';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderService } from '../services/order.service';

@Controller()
export class OrderConsumerController {
  constructor(private readonly orderService: OrderService) {}

  @EventPattern(QueueTopics.PAYMENT.CANCEL_ORDER_BY_PAYMENT)
  cancelOrders(@Payload() payload: { paymentId: string }) {
    return this.orderService.cancelOrdersByPayment(payload);
  }
}
