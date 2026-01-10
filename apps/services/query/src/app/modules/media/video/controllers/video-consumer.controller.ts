import { QueueTopics } from '@common/constants/queue.constant';
import { VideoResponse } from '@common/interfaces/models/media';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VideoService } from '../services/video.service';

type VideoPayload = VideoResponse & { username: string; avatar: string };

@Controller()
export class VideoConsumerController {
  constructor(private readonly videoService: VideoService) {}

  @EventPattern(QueueTopics.MEDIA.UPSERT_VIDEO)
  async upsertVideo(@Payload() payload: VideoPayload) {
    return this.videoService.upsert(payload);
  }

  @EventPattern(QueueTopics.MEDIA.DELETE_VIDEO)
  async deleteVideo(@Payload() payload: { id: string }) {
    return this.videoService.delete(payload);
  }
}
