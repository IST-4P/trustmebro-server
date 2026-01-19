import { Module } from '@nestjs/common';
import { ReviewConsumerController } from './controllers/review-consumer.controller';
import { ReviewGrpcController } from './controllers/review-grpc.controller';
import { ReviewRepository } from './repositories/review.repository';
import { ReviewService } from './services/review.service';

@Module({
  controllers: [ReviewConsumerController, ReviewGrpcController],
  providers: [ReviewRepository, ReviewService],
})
export class ReviewModule {}
