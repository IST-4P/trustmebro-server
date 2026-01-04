import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ImageController } from './controllers/image.controller';
import { PlaybackController } from './controllers/playback.controller';
import { TusdController } from './controllers/tusd.controller';
import { ImageService } from './services/image.service';
import { PlaybackService } from './services/playback.service';
import { TusdService } from './services/tusd.service';
import { VideoService } from './services/video.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.MEDIA_SERVICE)]),
  ],
  controllers: [ImageController, TusdController, PlaybackController],
  providers: [ImageService, TusdService, VideoService, PlaybackService],
})
export class MediaModule {}
