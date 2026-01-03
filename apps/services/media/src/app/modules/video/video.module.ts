import { Module } from '@nestjs/common';
import { VideoConsumerController } from './controllers/video-consumer.controller';
import { VideoGrpcController } from './controllers/video-grpc.controller';
import { VideoController } from './controllers/video.controller';
import { VideoRepository } from './repositories/video.repository';
import { FfmpegService } from './services/ffmpeg.service';
import { VideoService } from './services/video.service';

@Module({
  controllers: [VideoGrpcController, VideoConsumerController, VideoController],
  providers: [VideoRepository, VideoService, FfmpegService],
})
export class VideoModule {}
