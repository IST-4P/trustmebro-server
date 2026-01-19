import { QueueTopics } from '@common/constants/queue.constant';
import { ReviewResponse } from '@common/interfaces/models/review';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReviewService } from '../services/review.service';

@Controller()
export class ReviewConsumerController {
  constructor(private readonly reviewService: ReviewService) {}

  @EventPattern(QueueTopics.REVIEW.CREATE_REVIEW)
  createReview(@Payload() payload: ReviewResponse) {
    return this.reviewService.create(payload);
  }
}
