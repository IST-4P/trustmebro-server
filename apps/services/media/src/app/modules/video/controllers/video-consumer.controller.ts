import { QueueTopics } from '@common/constants/queue.constant';
import { ProcessVideoRequest } from '@common/interfaces/models/media';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VideoProducer } from '../producers/video.producer';

@Controller()
export class VideoConsumerController {
  constructor(private readonly videoProducer: VideoProducer) {}

  @EventPattern(QueueTopics.MEDIA.VIDEO_UPLOADED)
  async processVideo(@Payload() payload: ProcessVideoRequest) {
    await this.videoProducer.processVideoJob(payload);
    return;
  }
}
