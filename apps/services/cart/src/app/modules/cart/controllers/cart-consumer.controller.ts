import { QueueTopics } from '@common/constants/queue.constant';
import { DeleteCartItemRequest } from '@common/interfaces/models/cart';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CartItemService } from '../services/cart-item.service';

@Controller()
export class CartConsumerController {
  constructor(private readonly cartItemService: CartItemService) {}

  @EventPattern(QueueTopics.PRODUCT.STOCK_DECREASE)
  deleteCartItems(@Payload() payload: DeleteCartItemRequest) {
    return this.cartItemService.delete(payload);
  }
}
