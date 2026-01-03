import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreateVideoRequest,
  DeleteVideoRequest,
  UpdateVideoRequest,
} from '@common/interfaces/models/media';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { VideoService } from '../services/video.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class VideoGrpcController {
  constructor(private readonly brandService: VideoService) {}

  @GrpcMethod(GrpcServiceName.MEDIA_SERVICE, 'CreateVideo')
  createVideo(data: CreateVideoRequest) {
    return this.brandService.create(data);
  }

  @GrpcMethod(GrpcServiceName.MEDIA_SERVICE, 'UpdateVideo')
  updateVideo(data: UpdateVideoRequest) {
    return this.brandService.update(data);
  }

  @GrpcMethod(GrpcServiceName.MEDIA_SERVICE, 'DeleteVideo')
  deleteVideo(data: DeleteVideoRequest) {
    return this.brandService.delete(data);
  }
}
