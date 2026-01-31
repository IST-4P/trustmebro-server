import {
  CreateReviewRequest,
  DeleteReviewRequest,
  REVIEW_SERVICE_NAME,
  REVIEW_SERVICE_PACKAGE_NAME,
  ReviewServiceClient,
  UpdateReviewRequest,
} from '@common/interfaces/proto-types/review';
import {
  BadRequestException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { ReviewReadService } from './review-read.service';

@Injectable()
export class ReviewWriteService implements OnModuleInit {
  private reviewService!: ReviewServiceClient;

  constructor(
    @Inject(REVIEW_SERVICE_PACKAGE_NAME)
    private reviewClient: ClientGrpc,
    private readonly reviewReadService: ReviewReadService
  ) {}

  onModuleInit() {
    this.reviewService =
      this.reviewClient.getService<ReviewServiceClient>(REVIEW_SERVICE_NAME);
  }

  async createReview(data: CreateReviewRequest) {
    try {
      const checkReview = await this.reviewReadService.getReview({
        orderId: data.orderId,
        orderItemId: data.orderItemId,
      });
      console.log(checkReview);
      if (checkReview) {
        throw new BadRequestException('Error.ReviewAlreadyExists');
      }
      const createdReview = await firstValueFrom(
        this.reviewService.createReview(data)
      );
      console.log({ createdReview });
      return createdReview.review;
    } catch (error) {
      console.log(error);
    }
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
