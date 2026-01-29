import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ReplyConsumerController } from './controllers/reply-consumer.controller';
import { ReviewConsumerController } from './controllers/review-consumer.controller';
import { ReviewGrpcController } from './controllers/review-grpc.controller';
import { ReplyRepository } from './repositories/reply.repository';
import { ReviewRepository } from './repositories/review.repository';
import { ReplyService } from './services/reply.service';
import { ReviewService } from './services/review.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
    ]),
  ],
  controllers: [
    ReviewConsumerController,
    ReviewGrpcController,
    ReplyConsumerController,
  ],
  providers: [ReviewRepository, ReviewService, ReplyService, ReplyRepository],
})
export class ReviewModule {}
