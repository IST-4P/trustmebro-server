import {
  CreateVideoRequest,
  DeleteVideoRequest,
  MEDIA_SERVICE_NAME,
  MEDIA_SERVICE_PACKAGE_NAME,
  MediaServiceClient,
  UpdateVideoRequest,
  VideoResponse,
} from '@common/interfaces/proto-types/media';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VideoService implements OnModuleInit {
  private mediaService!: MediaServiceClient;

  constructor(
    @Inject(MEDIA_SERVICE_PACKAGE_NAME)
    private mediaClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.mediaService =
      this.mediaClient.getService<MediaServiceClient>(MEDIA_SERVICE_NAME);
  }

  createVideo(data: CreateVideoRequest): Promise<VideoResponse> {
    return firstValueFrom(this.mediaService.createVideo(data));
  }

  updateVideo(data: UpdateVideoRequest): Promise<VideoResponse> {
    return firstValueFrom(this.mediaService.updateVideo(data));
  }

  deleteVideo(data: DeleteVideoRequest): Promise<VideoResponse> {
    return firstValueFrom(this.mediaService.deleteVideo(data));
  }
}
