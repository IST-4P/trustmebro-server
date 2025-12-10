import { GrpcLoggingInterceptor } from '@common/interceptors/grpcLogging.interceptor';
import {
  CreatePresignedUrlRequest,
  CreatePresignedUrlResponse,
} from '@common/interfaces/models/media';
import { Controller, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { ImageService } from '../services/image.service';

@Controller()
@UseInterceptors(GrpcLoggingInterceptor)
export class ImageGrpcController {
  constructor(private readonly imageService: ImageService) {}

  @GrpcMethod('MediaService', 'CreatePresignedUrl')
  async createPresignedUrl(
    data: CreatePresignedUrlRequest
  ): Promise<CreatePresignedUrlResponse> {
    return this.imageService.createPresignedUrl(data);
  }
}
