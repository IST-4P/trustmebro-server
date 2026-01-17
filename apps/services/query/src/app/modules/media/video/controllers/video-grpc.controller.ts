import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  GetManyVideosRequest,
  GetVideoRequest,
} from '@common/interfaces/models/media';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { VideoService } from '../services/video.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class VideoGrpcController {
  constructor(private readonly videoService: VideoService) {}

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetManyVideos')
  getManyVideos(data: GetManyVideosRequest) {
    return this.videoService.list(data);
  }

  @GrpcMethod(GrpcServiceName.QUERY_SERVICE, 'GetVideo')
  getVideo(data: GetVideoRequest) {
    return this.videoService.findById(data);
  }
}
