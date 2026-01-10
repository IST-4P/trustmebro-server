import {
  PROCESS_VIDEO_JOB_NAME,
  VIDEO_QUEUE_NAME,
} from '@common/constants/media.constant';
import { ProcessVideoRequest } from '@common/interfaces/models/media';
import { generateProcessVideoJobId } from '@common/utils/bullmq.util';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class VideoProducer {
  constructor(@InjectQueue(VIDEO_QUEUE_NAME) private videoQueue: Queue) {}

  async processVideoJob(payload: ProcessVideoRequest) {
    await this.videoQueue.add(PROCESS_VIDEO_JOB_NAME, payload, {
      jobId: generateProcessVideoJobId(payload.id),
      attempts: 5,
      backoff: { type: 'exponential', delay: 30_000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}
