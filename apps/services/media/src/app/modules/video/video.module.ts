import { Module } from '@nestjs/common';
import { VideoConsumerController } from './controllers/video-consumer.controller';
import { VideoGrpcController } from './controllers/video-grpc.controller';
import { VideoController } from './controllers/video.controller';
import { VideoProducer } from './producers/video.producer';
import { VideoQueue } from './queues/video.queue';
import { VideoRepository } from './repositories/video.repository';
import { FfmpegService } from './services/ffmpeg.service';
import { VideoService } from './services/video.service';

@Module({
  controllers: [VideoGrpcController, VideoConsumerController, VideoController],
  providers: [
    VideoRepository,
    VideoService,
    FfmpegService,
    VideoProducer,
    VideoQueue,
  ],
})
export class VideoModule {}
