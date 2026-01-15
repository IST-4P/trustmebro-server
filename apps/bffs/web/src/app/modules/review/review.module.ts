import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ReviewController } from './controllers/review.controller';
import { ReviewWriteService } from './services/review-write.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.REVIEW_SERVICE)]),
  ],
  controllers: [ReviewController],
  providers: [ReviewWriteService],
})
export class ReviewModule {}
