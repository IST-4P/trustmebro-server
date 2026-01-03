import { MinioConfiguration } from '@common/configurations/minio.config';
import { VideoStatusValues } from '@common/constants/media.constant';
import { QueueTopics } from '@common/constants/queue.constant';
import { TusdWebhookRequest } from '@common/interfaces/models/media';
import { KafkaService } from '@common/kafka/kafka.service';
import { Injectable } from '@nestjs/common';
import path from 'path';
import { VideoService } from './video.service';

@Injectable()
export class TusdService {
  constructor(
    private readonly kafkaService: KafkaService,
    private readonly videoService: VideoService
  ) {}

  private getExt(filename: string) {
    return path.extname(filename || '').toLowerCase();
  }

  private hasDoubleExtension(filename: string) {
    const parts = filename.toLowerCase().split('.');
    return parts.length > 2;
  }

  private addMessage(existingMessage: string, newMessage: string) {
    if (existingMessage) {
      return `${existingMessage} / ${newMessage}`;
    }
    return newMessage;
  }

  async validateFileUpload(data: TusdWebhookRequest) {
    const ALLOWED_VIDEO_EXT = new Set([
      '.mp4',
      '.mov',
      '.mkv',
      '.webm',
      '.avi',
      '.m4v',
    ]);
    const { filename, filetype } = data.Event.Upload.MetaData;
    const { Size } = data.Event.Upload;

    let errorMessage = '';

    if (this.hasDoubleExtension(filename)) {
      errorMessage = this.addMessage(
        errorMessage,
        'Filename contains multiple extensions which is not allowed'
      );
    }

    const ext = this.getExt(filename);

    if (!ALLOWED_VIDEO_EXT.has(ext)) {
      errorMessage = this.addMessage(
        errorMessage,
        `Unsupported file extension: ${ext}`
      );
    }

    if (!filetype?.startsWith('video/')) {
      errorMessage = this.addMessage(
        errorMessage,
        `Invalid file type: ${filetype}`
      );
    }

    if (Size > MinioConfiguration.MINIO_VIDEO_MAX_SIZE) {
      errorMessage = this.addMessage(
        errorMessage,
        `File size exceeds the maximum limit of ${MinioConfiguration.MINIO_VIDEO_MAX_SIZE} bytes`
      );
    }

    if (errorMessage) {
      return {
        RejectUpload: true,
        HTTPResponse: {
          StatusCode: 400,
          Body: errorMessage,
        },
      };
    }
    return { RejectUpload: false };
  }

  preCreate(data: { body: TusdWebhookRequest }) {
    return this.validateFileUpload(data.body);
  }

  postCreate({
    body,
    processId,
    userId,
  }: {
    body: TusdWebhookRequest;
    processId: string;
    userId: string;
  }) {
    return this.videoService.createVideo({
      processId,
      userId,
      id: body.Event.Upload.ID,
      storageBucket: body.Event.Upload.Storage.Bucket,
      storageKey: body.Event.Upload.Storage.Key,
      size: body.Event.Upload.Size,
      filename: body.Event.Upload.MetaData.filename,
      filetype: body.Event.Upload.MetaData.filetype,
    });
  }

  async postFinish({
    body,
    processId,
    userId,
  }: {
    body: TusdWebhookRequest;
    processId: string;
    userId: string;
  }) {
    const updatedVideo = await this.videoService.updateVideo({
      processId,
      id: body.Event.Upload.ID,
      status: VideoStatusValues.UPLOADED,
      updatedById: userId,
    });
    this.kafkaService.emit(QueueTopics.MEDIA.VIDEO_UPLOADED, {
      storageKey: updatedVideo.storageKey,
      id: updatedVideo.id,
      processId,
      userId,
    });
  }
}
