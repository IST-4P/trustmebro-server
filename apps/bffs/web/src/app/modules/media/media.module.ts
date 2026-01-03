import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ImageController } from './controllers/image.controller';
import { TusdController } from './controllers/tusd.controller';
import { ImageService } from './services/image.service';
import { TusdService } from './services/tusd.service';
import { VideoService } from './services/video.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.MEDIA_SERVICE)]),
  ],
  controllers: [ImageController, TusdController],
  providers: [ImageService, TusdService, VideoService],
})
export class MediaModule {}
