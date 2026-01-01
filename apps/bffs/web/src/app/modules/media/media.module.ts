import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ImageController } from './controllers/image.controller';
import { ImageService } from './services/image.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.MEDIA_SERVICE)]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class MediaModule {}
