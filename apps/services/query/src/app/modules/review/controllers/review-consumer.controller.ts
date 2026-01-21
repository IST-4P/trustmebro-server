import { QueueTopics } from '@common/constants/queue.constant';
import {
  CreateReviewResponse,
  UpdateReviewResponse,
} from '@common/interfaces/models/review';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReviewService } from '../services/review.service';

@Controller()
export class ReviewConsumerController {
  constructor(private readonly reviewService: ReviewService) {}

  @EventPattern(QueueTopics.REVIEW.CREATE_REVIEW)
  createReview(@Payload() payload: CreateReviewResponse) {
    return this.reviewService.create(payload);
  }

  @EventPattern(QueueTopics.REVIEW.UPDATE_REVIEW)
  updateReview(@Payload() payload: UpdateReviewResponse) {
    return this.reviewService.update(payload);
  }

  @EventPattern(QueueTopics.REVIEW.DELETE_REVIEW)
  deleteReview(@Payload() payload: { ReviewId: string }) {
    return this.reviewService.delete(payload);
  }
}
