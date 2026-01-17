import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { VideoController } from './controllers/video.controller';
import { VideoReadService } from './services/video-read.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.QUERY_SERVICE)]),
  ],
  controllers: [VideoController],
  providers: [VideoReadService],
})
export class MediaModule {}
