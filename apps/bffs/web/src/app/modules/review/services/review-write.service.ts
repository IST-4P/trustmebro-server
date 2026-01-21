import {
  CreateReviewRequest,
  DeleteReviewRequest,
  REVIEW_SERVICE_NAME,
  REVIEW_SERVICE_PACKAGE_NAME,
  ReviewServiceClient,
  UpdateReviewRequest,
} from '@common/interfaces/proto-types/review';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReviewWriteService implements OnModuleInit {
  private reviewService!: ReviewServiceClient;

  constructor(
    @Inject(REVIEW_SERVICE_PACKAGE_NAME)
    private reviewClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.reviewService =
      this.reviewClient.getService<ReviewServiceClient>(REVIEW_SERVICE_NAME);
  }

  async createReview(data: CreateReviewRequest) {
    const createdReview = await firstValueFrom(
      this.reviewService.createReview(data)
    );
    return createdReview.review;
  }

  async updateReview(data: UpdateReviewRequest) {
    const updatedReview = await firstValueFrom(
      this.reviewService.updateReview(data)
    );
    return updatedReview.review;
  }

  async deleteReview(data: DeleteReviewRequest) {
    await firstValueFrom(this.reviewService.deleteReview(data));
    return {
      message: 'Message.ReviewDeletedSuccessfully',
    };
  }
}
