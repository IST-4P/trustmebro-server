import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ReplyController } from './controllers/reply.controller';
import { ReviewController } from './controllers/review.controller';
import { ReplyWriteService } from './services/reply-write.service';
import { ReviewReadService } from './services/review-read.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.REVIEW_SERVICE),
      GrpcClientProvider(GrpcService.QUERY_SERVICE),
    ]),
  ],
  controllers: [ReviewController, ReplyController],
  providers: [ReplyWriteService, ReviewReadService, ReplyWriteService],
})
export class ReviewModule {}
