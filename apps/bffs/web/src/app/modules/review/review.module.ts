import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ReviewController } from './controllers/review.controller';
import { ReviewReadService } from './services/review-read.service';
import { ReviewWriteService } from './services/review-write.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.REVIEW_SERVICE),
      GrpcClientProvider(GrpcService.QUERY_SERVICE),
    ]),
  ],
  controllers: [ReviewController],
  providers: [ReviewWriteService, ReviewReadService],
})
export class ReviewModule {}
