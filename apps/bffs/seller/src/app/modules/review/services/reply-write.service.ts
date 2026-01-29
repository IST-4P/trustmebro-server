import {
  CreateReplyRequest,
  DeleteReplyRequest,
  REVIEW_SERVICE_NAME,
  REVIEW_SERVICE_PACKAGE_NAME,
  ReviewServiceClient,
  UpdateReplyRequest,
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
export class ReplyWriteService implements OnModuleInit {
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

  async createReply(data: CreateReplyRequest) {
    const review = await this.reviewReadService.getReview({
      id: data.reviewId,
    });

    if (review.reply) {
      throw new BadRequestException('Error.ReplyAlreadyExists');
    }
    const createdReply = await firstValueFrom(
      this.reviewService.createReply(data)
    );
    const { replies, ...result } = createdReply.review;
    return {
      ...result,
      reply: {
        reviewId: replies.reviewId,
        shopId: replies.sellerId,
        content: replies.content,
      },
    };
  }

  async updateReply(data: UpdateReplyRequest) {
    const updatedReply = await firstValueFrom(
      this.reviewService.updateReply(data)
    );
    const { replies, ...result } = updatedReply.review;
    return {
      ...result,
      reply: {
        reviewId: replies.reviewId,
        shopId: replies.sellerId,
        content: replies.content,
      },
    };
  }

  async deleteReply(data: DeleteReplyRequest) {
    await firstValueFrom(this.reviewService.deleteReply(data));
    return {
      message: 'Message.ReplyDeletedSuccessfully',
    };
  }
}
