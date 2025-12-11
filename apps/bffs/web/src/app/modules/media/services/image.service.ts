import {
  CreatePresignedUrlRequest,
  MEDIA_SERVICE_NAME,
  MEDIA_SERVICE_PACKAGE_NAME,
  MediaServiceClient,
} from '@common/interfaces/proto-types/media';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ImageService implements OnModuleInit {
  private mediaService!: MediaServiceClient;

  constructor(
    @Inject(MEDIA_SERVICE_PACKAGE_NAME)
    private mediaClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.mediaService =
      this.mediaClient.getService<MediaServiceClient>(MEDIA_SERVICE_NAME);
  }

  async createPresignedUrl(data: CreatePresignedUrlRequest) {
    const result = await firstValueFrom(
      this.mediaService.createPresignedUrl(data)
    );
    return result;
  }
}
