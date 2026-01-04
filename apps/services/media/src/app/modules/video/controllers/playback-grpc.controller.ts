import { GrpcServiceName } from '@common/constants/grpc.constant';
import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import { GetPlaybackRequest } from '@common/interfaces/models/media';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { PlaybackService } from '../services/playback.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class PlaybackGrpcController {
  constructor(private readonly playbackService: PlaybackService) {}

  @GrpcMethod(GrpcServiceName.MEDIA_SERVICE, 'GetPlayback')
  getPlayback(data: GetPlaybackRequest) {
    return this.playbackService.getPlayback(data);
  }
}
