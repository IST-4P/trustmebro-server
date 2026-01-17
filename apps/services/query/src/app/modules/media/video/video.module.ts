import { Module } from '@nestjs/common';
import { VideoConsumerController } from './controllers/video-consumer.controller';
import { VideoGrpcController } from './controllers/video-grpc.controller';
import { VideoRepository } from './repositories/video.repository';
import { VideoService } from './services/video.service';

@Module({
  controllers: [VideoConsumerController, VideoGrpcController],
  providers: [VideoRepository, VideoService],
})
export class VideoModule {}
