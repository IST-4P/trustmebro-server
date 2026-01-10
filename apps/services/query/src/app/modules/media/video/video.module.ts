import { Module } from '@nestjs/common';
import { VideoConsumerController } from './controllers/video-consumer.controller';
import { VideoRepository } from './repositories/video.repository';
import { VideoService } from './services/video.service';

@Module({
  controllers: [VideoConsumerController],
  providers: [VideoRepository, VideoService],
})
export class VideoModule {}
