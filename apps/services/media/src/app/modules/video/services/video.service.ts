import { PrismaErrorValues } from '@common/constants/prisma.constant';
import {
  CreateVideoRequest,
  DeleteVideoRequest,
  GetVideoRequest,
  UpdateVideoRequest,
  VideoResponse,
} from '@common/interfaces/models/media';
import { Injectable, NotFoundException } from '@nestjs/common';
import { VideoRepository } from '../repositories/video.repository';

@Injectable()
export class VideoService {
  constructor(private readonly videoRepository: VideoRepository) {}

  async findById({
    processId,
    ...data
  }: GetVideoRequest): Promise<VideoResponse> {
    const video = await this.videoRepository.find(data);
    if (!video) {
      throw new NotFoundException('Error.VideoNotFound');
    }
    return video;
  }

  async create({
    processId,
    ...data
  }: CreateVideoRequest): Promise<VideoResponse> {
    try {
      const createdVideo = await this.videoRepository.create(data);
      return createdVideo;
    } catch (error) {
      if (error.code === PrismaErrorValues.UNIQUE_CONSTRAINT_VIOLATION) {
        throw new NotFoundException('Error.VideoAlreadyExists');
      }
      throw error;
    }
  }

  async update({
    processId,
    ...data
  }: UpdateVideoRequest): Promise<VideoResponse> {
    try {
      const updatedVideo = await this.videoRepository.update(data);
      return updatedVideo;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.VideoNotFound');
      }
      throw error;
    }
  }

  async delete(data: DeleteVideoRequest): Promise<VideoResponse> {
    try {
      const deletedVideo = await this.videoRepository.delete(data, false);
      return deletedVideo;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.VideoNotFound');
      }
      throw error;
    }
  }
}
