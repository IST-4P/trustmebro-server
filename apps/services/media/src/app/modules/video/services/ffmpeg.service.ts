import { S3Client } from '@aws-sdk/client-s3';
import {
  MinioBucket,
  MinioConfiguration,
  MinioProvider,
} from '@common/configurations/minio.config';
import { VideoStatusValues } from '@common/constants/media.constant';
import { ProcessVideoRequest } from '@common/interfaces/models/media';
import {
  ffprobeJson,
  makeThumbnail,
  transcodeToHlsAbr,
} from '@common/utils/hls.util';
import { downloadToFile, uploadDirectory } from '@common/utils/minio.utils';
import { BadRequestException, Injectable } from '@nestjs/common';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { VideoRepository } from '../repositories/video.repository';
import { VideoService } from './video.service';

@Injectable()
export class FfmpegService {
  private S3Client: S3Client;
  private bucket: string;

  constructor(
    private readonly videoService: VideoService,
    private readonly videoRepository: VideoRepository
  ) {
    const { client, bucket } = MinioProvider(MinioBucket.VIDEO_BUCKET);
    this.S3Client = client;
    this.bucket = bucket;
  }

  async downloadVideo(key: string) {
    const name = `${key.replace(/^tus\//, '')}`;
    const fileName = MinioConfiguration.MINIO_VIDEO_NAME;
    const tmpDir = path.join(
      os.tmpdir(),
      MinioConfiguration.MINIO_DOWNLOAD_VIDEO_FOLDER,
      name
    );

    await fs.promises.mkdir(tmpDir, { recursive: true });

    const inputPath = path.join(tmpDir, fileName);

    await downloadToFile({
      key,
      bucket: this.bucket,
      destPath: inputPath,
      s3: this.S3Client,
    });

    return inputPath;
  }

  async getVideoMetaData(inputPath: string) {
    const j = await ffprobeJson(inputPath);

    const v0 = j?.streams?.find((s: any) => s.codec_type === 'video');
    const duration = Number(j?.format?.duration ?? v0?.duration);

    if (!Number.isFinite(duration) || duration <= 0) {
      throw new BadRequestException('Cannot determine duration from ffprobe');
    }

    return {
      durationSeconds: duration,
      width: Number(v0?.width ?? 0),
      height: Number(v0?.height ?? 0),
    };
  }

  async processVideo(data: ProcessVideoRequest) {
    const claimed = await this.videoRepository.updateMany({
      where: { id: data.id, status: VideoStatusValues.UPLOADED },
      data: {
        status: VideoStatusValues.PROCESSING,
        updatedAt: new Date(),
      },
    });

    if (claimed.count === 0) return; // đã bị worker khác claim, hoặc đã READY/FAILED

    const name = `${data.storageKey.replace(/^tus\//, '')}`;
    const baseTmpDir = path.join(
      os.tmpdir(),
      MinioConfiguration.MINIO_DOWNLOAD_VIDEO_FOLDER,
      name
    );
    const outDir = path.join(baseTmpDir, 'out');

    await fs.promises.mkdir(outDir, { recursive: true });

    try {
      // Download
      const inputPath = await this.downloadVideo(data.storageKey);

      // Get Metadata
      const meta = await this.getVideoMetaData(inputPath);

      // Transcode HLS ABR
      await transcodeToHlsAbr(inputPath, outDir);

      // // Thumbnail
      await makeThumbnail(
        inputPath,
        path.join(outDir, MinioConfiguration.MINIO_THUMBNAIL_NAME)
      );

      // Upload outDir → MinIO
      await uploadDirectory({
        bucket: this.bucket,
        prefix: `hls/${name}`,
        dir: outDir,
        s3: this.S3Client,
      });

      // Update DB → READY
      await this.videoService.update({
        id: data.id,
        processId: data.processId,
        status: VideoStatusValues.READY,
        duration: Math.round(meta.durationSeconds),
        width: meta.width,
        height: meta.height,
      });
    } finally {
      // Cleanup
      await fs.promises.rm(baseTmpDir, { recursive: true, force: true });
    }
  }
}
