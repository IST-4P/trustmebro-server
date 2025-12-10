import { S3Client } from '@aws-sdk/client-s3';
import z from 'zod';

export const MinioConfigurationSchema = z.object({
  MINIO_ENDPOINT: z.string(),
  MINIO_REGION: z.string(),
  MINIO_ACCESS_KEY: z.string(),
  MINIO_SECRET_KEY: z.string(),
  MINIO_IMAGE_BUCKET: z.string(),
});

export enum MinioBucket {
  IMAGE_BUCKET = 'IMAGE_BUCKET',
}

const configServer = MinioConfigurationSchema.safeParse(process.env);

if (!configServer.success) {
  console.log('Các giá trị trong .env không hợp lệ');
  console.error(configServer.error);
  process.exit(1);
}

export const MinioConfiguration = configServer.data;

export const MinioProvider = (bucketName: MinioBucket) => {
  const client = new S3Client({
    endpoint: MinioConfiguration.MINIO_ENDPOINT,
    region: MinioConfiguration.MINIO_REGION,
    credentials: {
      accessKeyId: MinioConfiguration.MINIO_ACCESS_KEY,
      secretAccessKey: MinioConfiguration.MINIO_SECRET_KEY,
    },
    forcePathStyle: true,
  });

  const bucket = MinioConfiguration[`MINIO_${bucketName}`];

  return { client, bucket };
};
