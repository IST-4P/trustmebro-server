import {
  PROCESS_VIDEO_JOB_NAME,
  VIDEO_QUEUE_NAME,
} from '@common/constants/media.constant';
import { ProcessVideoRequest } from '@common/interfaces/models/media';
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { FfmpegService } from '../services/ffmpeg.service';

@Processor(VIDEO_QUEUE_NAME)
@Injectable()
export class VideoQueue extends WorkerHost {
  constructor(private readonly ffmpegService: FfmpegService) {
    super();
  }

  async process(job: Job<ProcessVideoRequest, any, string>): Promise<any> {
    switch (job.name) {
      case PROCESS_VIDEO_JOB_NAME: {
        try {
          await this.ffmpegService.processVideo(job.data);

          return {};
        } catch (e: any) {
          Logger.error(
            `FFmpeg job failed: videoId=${job.data.id} jobId=${job.id} err=${
              e?.message ?? e
            }`
          );
          throw e;
        }
      }

      default:
        return;
    }
  }
}
