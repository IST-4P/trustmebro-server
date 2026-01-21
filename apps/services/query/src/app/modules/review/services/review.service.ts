import {
  CreateReviewResponse,
  GetManyProductReviewsRequest,
  GetManyProductReviewsResponse,
  UpdateReviewResponse,
} from '@common/interfaces/models/review';
import { Injectable } from '@nestjs/common';
import {
  CreateReviewMapper,
  UpdateReviewMapper,
} from '../mappers/review.mapper';
import { ReviewRepository } from '../repositories/review.repository';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async list(
    data: GetManyProductReviewsRequest
  ): Promise<GetManyProductReviewsResponse> {
    const reviews = await this.reviewRepository.list(data);
    return reviews;
  }

  create(data: CreateReviewResponse) {
    return this.reviewRepository.create(CreateReviewMapper(data));
  }

  update(data: UpdateReviewResponse) {
    return this.reviewRepository.update(UpdateReviewMapper(data));
  }

  delete(data: { ReviewId: string }) {
    return this.reviewRepository.delete({ id: data.ReviewId });
  }
}
