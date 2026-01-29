import { GetReviewRequest } from '@common/interfaces/models/review';
import {
  GetManyProductReviewsRequest,
  GetManyProductReviewsResponse,
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
  ReviewItem,
} from '@common/interfaces/proto-types/query';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ReviewReadService implements OnModuleInit {
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
  }

  async getManyProductReviews(
    data: GetManyProductReviewsRequest
  ): Promise<GetManyProductReviewsResponse> {
    return firstValueFrom(this.queryService.getManyProductReviews(data));
  }

  async getReview(data: GetReviewRequest): Promise<ReviewItem> {
    return firstValueFrom(this.queryService.getReview(data));
  }
}
