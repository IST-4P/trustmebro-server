import {
  GetManyVideosRequest,
  GetManyVideosResponse,
  GetVideoRequest,
  QUERY_SERVICE_NAME,
  QUERY_SERVICE_PACKAGE_NAME,
  QueryServiceClient,
  VideoResponse,
} from '@common/interfaces/proto-types/query';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class VideoReadService implements OnModuleInit {
  private queryService!: QueryServiceClient;

  constructor(
    @Inject(QUERY_SERVICE_PACKAGE_NAME)
    private queryClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.queryService =
      this.queryClient.getService<QueryServiceClient>(QUERY_SERVICE_NAME);
  }

  async getManyVideos(
    data: GetManyVideosRequest
  ): Promise<GetManyVideosResponse> {
    return firstValueFrom(this.queryService.getManyVideos(data));
  }

  async getVideo(data: GetVideoRequest): Promise<VideoResponse> {
    return firstValueFrom(this.queryService.getVideo(data));
  }
}
