import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  MinioBucket,
  MinioProvider,
} from '@common/configurations/minio.config';
import { Injectable } from '@nestjs/common';
import mime from 'mime-types';

@Injectable()
export class S3Service {
  private S3Client: S3Client;
  private bucket: string;

  constructor() {
    const { client, bucket } = MinioProvider(MinioBucket.IMAGE_BUCKET);
    this.S3Client = client;
    this.bucket = bucket;
  }

  createPresignedUrlWithClient = async (filename: string) => {
    const contentType = mime.lookup(filename) || 'application/octet-stream';

    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: filename,
      ContentType: contentType,
    });

    return getSignedUrl(this.S3Client, command, { expiresIn: 3600 });
  };
}
