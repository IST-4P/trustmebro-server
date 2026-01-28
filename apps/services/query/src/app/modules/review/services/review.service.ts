import {
  CreateReviewResponse,
  GetManyProductReviewsRequest,
  GetManyProductReviewsResponse,
  GetReviewRequest,
  ReviewResponse,
  UpdateReviewResponse,
} from '@common/interfaces/models/review';
import {
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
} from '@common/interfaces/proto-types/user-access';
import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import {
  CreateReviewMapper,
  UpdateReviewMapper,
} from '../mappers/review.mapper';
import { ReviewRepository } from '../repositories/review.repository';

@Injectable()
export class ReviewService {
  private userAccessService!: UserAccessServiceClient;

  constructor(
    private readonly reviewRepository: ReviewRepository,
    @Inject(USER_ACCESS_SERVICE_PACKAGE_NAME)
    private userAccessClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.userAccessService =
      this.userAccessClient.getService<UserAccessServiceClient>(
        USER_ACCESS_SERVICE_NAME
      );
  }

  async list(
    data: GetManyProductReviewsRequest
  ): Promise<GetManyProductReviewsResponse> {
    const reviews = await this.reviewRepository.list(data);
    const userIds = reviews.reviews.map((review) => review.userId);
    const users = await firstValueFrom(
      this.userAccessService.getManyInformationUsers({
        userIds,
      })
    );

    const newReview = reviews.reviews.map((review) => {
      const user = users.users[review.userId];
      return {
        ...review,
        username: user?.username,
        avatar: user?.avatar,
      };
    });

    return {
      ...reviews,
      reviews: newReview,
    };
  }

  async getReview(data: GetReviewRequest): Promise<ReviewResponse> {
    return this.reviewRepository.getReview(data);
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
