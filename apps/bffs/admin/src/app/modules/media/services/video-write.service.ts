import {
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
export class VideoWriteService implements OnModuleInit {
  private mediaService!: MediaServiceClient;

  constructor(
    @Inject(MEDIA_SERVICE_PACKAGE_NAME)
    private mediaClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.mediaService =
      this.mediaClient.getService<MediaServiceClient>(MEDIA_SERVICE_NAME);
  }

  async updateVideo(data: UpdateVideoRequest): Promise<VideoResponse> {
    return firstValueFrom(this.mediaService.updateVideo(data));
  }

  async deleteVideo(data: DeleteVideoRequest): Promise<VideoResponse> {
    return firstValueFrom(this.mediaService.deleteVideo(data));
  }
}
