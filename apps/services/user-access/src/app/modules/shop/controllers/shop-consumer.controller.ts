import { QueueTopics } from '@common/constants/queue.constant';
import { UpdateShopRatingRequest } from '@common/interfaces/models/user-access';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ShopService } from '../services/shop.service';

@Controller()
export class ShopConsumerController {
  constructor(private readonly shopService: ShopService) {}

  @EventPattern(QueueTopics.USER_ACCESS.UPDATE_SHOP)
  updateShop(@Payload() payload: UpdateShopRatingRequest) {
    return this.shopService.updateRating(payload);
  }
}
