import { VideoResponse } from '@common/interfaces/models/media';
import { Injectable } from '@nestjs/common';
import { VideoMapper } from '../mappers/video.mapper';
import { VideoRepository } from '../repositories/video.repository';

@Injectable()
export class VideoService {
  constructor(private readonly videoRepository: VideoRepository) {}

  create(data: VideoResponse & { username: string; avatar: string }) {
    return this.videoRepository.create(VideoMapper(data));
  }

  update(data: VideoResponse & { username: string; avatar: string }) {
    return this.videoRepository.update(VideoMapper(data));
  }

  delete(data: { id: string }) {
    return this.videoRepository.delete({ id: data.id });
  }
}
