import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  GetManyProductReviewsRequest,
  GetReviewRequest,
} from '@common/interfaces/models/review';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ReviewService } from '../services/review.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class ReviewGrpcController {
  constructor(private readonly reviewService: ReviewService) {}

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetManyProductReviews')
  getManyProductReviews(data: GetManyProductReviewsRequest) {
    return this.reviewService.list(data);
  }

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetReview')
  getReview(data: GetReviewRequest) {
    return this.reviewService.getReview(data);
  }
}
