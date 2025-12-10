import { MinioConfiguration } from '@common/configurations/minio.config';
import { CreatePresignedUrlRequest } from '@common/interfaces/models/media';
import { generateRandomFileName } from '@common/utils/file-name.util';
import { Injectable } from '@nestjs/common';
import { S3Service } from './s3.service';

@Injectable()
export class ImageService {
  constructor(private readonly s3Service: S3Service) {}

  async createPresignedUrl(body: CreatePresignedUrlRequest) {
    const randomFilename = generateRandomFileName(body.filename);
    const presignedUrl = await this.s3Service.createPresignedUrlWithClient(
      randomFilename
    );

    // Tạo public URL để access file sau khi upload
    const endpoint = MinioConfiguration.MINIO_ENDPOINT;
    const bucket = MinioConfiguration.MINIO_IMAGE_BUCKET;
    const url = `${endpoint}/${bucket}/${randomFilename}`;

    return {
      presignedUrl,
      url,
    };
  }
}
