import { PrismaErrorValues } from '@common/constants/prisma.constant';
import { QueueTopics } from '@common/constants/queue.constant';
import {
  CreateVideoRequest,
  DeleteVideoRequest,
  GetVideoRequest,
  UpdateVideoRequest,
  VideoResponse,
} from '@common/interfaces/models/media';
import {
  GetUserRequest,
  USER_ACCESS_SERVICE_NAME,
  USER_ACCESS_SERVICE_PACKAGE_NAME,
  UserAccessServiceClient,
} from '@common/interfaces/proto-types/user-access';
import { KafkaService } from '@common/kafka/kafka.service';
import {
  Inject,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { VideoRepository } from '../repositories/video.repository';

@Injectable()
export class VideoService implements OnModuleInit {
  private userAccessService!: UserAccessServiceClient;

  constructor(
    @Inject(USER_ACCESS_SERVICE_PACKAGE_NAME)
    private userAccessClient: ClientGrpc,
    private readonly videoRepository: VideoRepository,
    private readonly kafkaService: KafkaService
  ) {}

  onModuleInit() {
    this.userAccessService =
      this.userAccessClient.getService<UserAccessServiceClient>(
        USER_ACCESS_SERVICE_NAME
      );
  }

  private async getUser(data: GetUserRequest) {
    return firstValueFrom(this.userAccessService.getUser(data));
  }

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
      const user = await this.getUser({ id: data.userId, processId });

      this.kafkaService.emit(QueueTopics.MEDIA.UPSERT_VIDEO, {
        ...createdVideo,
        username: user.username,
        avatar: user.avatar,
      });
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
      this.kafkaService.emit(QueueTopics.MEDIA.UPSERT_VIDEO, updatedVideo);
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
      this.kafkaService.emit(QueueTopics.MEDIA.DELETE_VIDEO, {
        id: deletedVideo.id,
      });
      return deletedVideo;
    } catch (error) {
      if (error.code === PrismaErrorValues.RECORD_NOT_FOUND) {
        throw new NotFoundException('Error.VideoNotFound');
      }
      throw error;
    }
  }
}
