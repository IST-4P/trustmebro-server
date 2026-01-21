import { QueueTopics } from '@common/constants/queue.constant';
import { CreatePromotionRedemptionRequest } from '@common/interfaces/models/promotion';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { RedemptionService } from '../services/redemption.service';

@Controller()
export class RedemptionConsumerController {
  constructor(private readonly redemptionService: RedemptionService) {}

  @EventPattern(QueueTopics.PROMOTION.CREATE_REDEMPTION)
  createRedemption(@Payload() payload: CreatePromotionRedemptionRequest) {
    return this.redemptionService.create(payload);
  }
}
