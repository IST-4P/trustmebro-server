import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { VIDEO_QUEUE_NAME } from '@common/constants/media.constant';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PlaybackGrpcController } from './controllers/playback-grpc.controller';
import { PlaybackController } from './controllers/playback.controller';
import { VideoConsumerController } from './controllers/video-consumer.controller';
import { VideoGrpcController } from './controllers/video-grpc.controller';
import { VideoProducer } from './producers/video.producer';
import { VideoQueue } from './queues/video.queue';
import { VideoRepository } from './repositories/video.repository';
import { FfmpegService } from './services/ffmpeg.service';
import { PlaybackService } from './services/playback.service';
import { VideoService } from './services/video.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.USER_ACCESS_SERVICE),
    ]),
    BullModule.registerQueue({ name: VIDEO_QUEUE_NAME }),
  ],
  controllers: [
    VideoGrpcController,
    VideoConsumerController,
    PlaybackGrpcController,
    PlaybackController,
  ],
  providers: [
    VideoRepository,
    VideoService,
    FfmpegService,
    VideoProducer,
    VideoQueue,
    PlaybackService,
  ],
})
export class VideoModule {}
