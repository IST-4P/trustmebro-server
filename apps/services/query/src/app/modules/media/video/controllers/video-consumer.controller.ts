import { QueueTopics } from '@common/constants/queue.constant';
import { VideoResponse } from '@common/interfaces/models/media';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { VideoService } from '../services/video.service';

@Controller()
export class VideoConsumerController {
  constructor(private readonly videoService: VideoService) {}

  @EventPattern(QueueTopics.MEDIA.CREATE_VIDEO)
  createVideo(
    @Payload() payload: VideoResponse & { username: string; avatar: string }
  ) {
    return this.videoService.create(payload);
  }

  @EventPattern(QueueTopics.MEDIA.UPDATE_VIDEO)
  updateVideo(
    @Payload() payload: VideoResponse & { username: string; avatar: string }
  ) {
    return this.videoService.update(payload);
  }

  @EventPattern(QueueTopics.MEDIA.DELETE_VIDEO)
  deleteVideo(@Payload() payload: { id: string }) {
    return this.videoService.delete(payload);
  }
}
