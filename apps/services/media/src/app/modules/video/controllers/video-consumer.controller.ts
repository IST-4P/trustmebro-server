import { QueueTopics } from '@common/constants/queue.constant';
import { ProcessVideoRequest } from '@common/interfaces/models/media';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { FfmpegService } from '../services/ffmpeg.service';

@Controller()
export class VideoConsumerController {
  constructor(private readonly ffmpegService: FfmpegService) {}

  @EventPattern(QueueTopics.MEDIA.VIDEO_UPLOADED)
  createVideo(@Payload() payload: ProcessVideoRequest) {
    return this.ffmpegService.processVideo(payload);
  }
}
