import { Module } from '@nestjs/common';
import { ReplyConsumerController } from './controllers/reply-consumer.controller';
import { ReviewConsumerController } from './controllers/review-consumer.controller';
import { ReviewGrpcController } from './controllers/review-grpc.controller';
import { ReplyRepository } from './repositories/reply.repository';
import { ReviewRepository } from './repositories/review.repository';
import { ReplyService } from './services/reply.service';
import { ReviewService } from './services/review.service';

@Module({
  controllers: [
    ReviewConsumerController,
    ReviewGrpcController,
    ReplyConsumerController,
  ],
  providers: [ReviewRepository, ReviewService, ReplyService, ReplyRepository],
})
export class ReviewModule {}
