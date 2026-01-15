import {
  CreateReviewRequest,
  CreateReviewResponse,
  REVIEW_SERVICE_NAME,
  REVIEW_SERVICE_PACKAGE_NAME,
  ReviewServiceClient,
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

  async createReview(data: CreateReviewRequest): Promise<CreateReviewResponse> {
    return firstValueFrom(this.reviewService.createReview(data));
  }
}
