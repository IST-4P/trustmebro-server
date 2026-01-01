import { Module } from '@nestjs/common';
import { ImageGrpcController } from './controllers/image-grpc.controller';
import { ImageService } from './services/image.service';
import { S3Service } from './services/s3.service';

@Module({
  controllers: [ImageGrpcController],
  providers: [S3Service, ImageService],
})
export class ImageModule {}
