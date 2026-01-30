import { GetRandomVideosRequest } from '@common/interfaces/models/media';
import {
  CreateVideoRequest,
  DeleteVideoRequest,
  MEDIA_SERVICE_NAME,
  MEDIA_SERVICE_PACKAGE_NAME,
  MediaServiceClient,
  UpdateVideoRequest,
  VideoResponse,
} from '@common/interfaces/proto-types/media';
import {
  GetRandomVideosResponse,
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
} from '@common/interfaces/proto-types/query';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VideoService implements OnModuleInit {
  private mediaService!: MediaServiceClient;
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(MEDIA_SERVICE_PACKAGE_NAME)
    private mediaClient: ClientGrpc,
    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.mediaService =
      this.mediaClient.getService<MediaServiceClient>(MEDIA_SERVICE_NAME);
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
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

  getFeed(data: GetRandomVideosRequest): Promise<GetRandomVideosResponse> {
    return firstValueFrom(this.queryService.getFeed(data));
  }
}
