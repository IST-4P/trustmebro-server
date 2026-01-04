import {
  GetPlaybackRequest,
  MEDIA_SERVICE_NAME,
  MEDIA_SERVICE_PACKAGE_NAME,
  MediaServiceClient,
  PlaybackResponse,
} from '@common/interfaces/proto-types/media';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PlaybackService implements OnModuleInit {
  private mediaService!: MediaServiceClient;

  constructor(
    @Inject(MEDIA_SERVICE_PACKAGE_NAME)
    private mediaClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.mediaService =
      this.mediaClient.getService<MediaServiceClient>(MEDIA_SERVICE_NAME);
  }

  getPlayback(data: GetPlaybackRequest): Promise<PlaybackResponse> {
    return firstValueFrom(this.mediaService.getPlayback(data));
  }
}
