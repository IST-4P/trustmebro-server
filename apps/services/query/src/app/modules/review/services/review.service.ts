import {
  GetManyProductReviewsRequest,
  GetManyProductReviewsResponse,
  ReviewResponse,
} from '@common/interfaces/models/review';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ReviewMapper } from '../mappers/review.mapper';
import { ReviewRepository } from '../repositories/review.repository';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async list(
    data: GetManyProductReviewsRequest
  ): Promise<GetManyProductReviewsResponse> {
    const reviews = await this.reviewRepository.list(data);
    if (reviews.totalItems === 0) {
      throw new NotFoundException('Error.ReviewsNotFound');
    }
    return reviews;
  }

  create(data: ReviewResponse) {
    return this.reviewRepository.create(ReviewMapper(data));
  }

  // cancel(data: { orderId: string }) {
  //   return this.orderRepository.update({
  //     id: data.orderId,
  //     status: OrderStatusValues.CANCELLED,
  //   });
  // }

  // update(data: OrderResponse) {
  //   return this.orderRepository.update(OrderMapper(data));
  // }
}
