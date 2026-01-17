import {
  GetManyVideosRequest,
  GetManyVideosResponse,
  GetVideoRequest,
  GetVideoResponse,
  VideoResponse,
} from '@common/interfaces/models/media';
import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoMapper } from '../mappers/video.mapper';
import { VideoRepository } from '../repositories/video.repository';

@Injectable()
export class VideoService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async list(data: GetManyVideosRequest): Promise<GetManyVideosResponse> {
    const videos = await this.videoRepository.list(data);
    if (videos.totalItems === 0) {
      throw new NotFoundException('Error.VideosNotFound');
    }
    return videos;
  }

  async findById({
    processId,
    ...data
  }: GetVideoRequest): Promise<GetVideoResponse> {
    const video = await this.videoRepository.findById(data);
    if (!video) {
      throw new NotFoundException('Error.VideoNotFound');
    }
    return video;
  }

  upsert(data: VideoResponse & { username: string; avatar: string }) {
    return this.videoRepository.upsert(VideoMapper(data));
  }

  delete(data: { id: string }) {
    return this.videoRepository.delete({ id: data.id });
  }
}
