import { RedisConfiguration } from '@common/configurations/redis.config';
import {
  CANCEL_PAYMENT_JOB_NAME,
  PAYMENT_QUEUE_NAME,
} from '@common/constants/payment.constant';
import { generateCancelPaymentJobId } from '@common/utils/cancel-payment.util';
import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class PaymentProducer {
  constructor(@InjectQueue(PAYMENT_QUEUE_NAME) private paymentQueue: Queue) {
    // paymentQueue.getJobs().then((job) => console.log(job))
  }

  async cancelPaymentJob(paymentId: string) {
    console.log('add queue');
    await this.paymentQueue.add(
      CANCEL_PAYMENT_JOB_NAME,
      { paymentId },
      {
        delay: RedisConfiguration.PAYMENT_TTL,
        jobId: generateCancelPaymentJobId(paymentId),
        removeOnComplete: true,
        removeOnFail: true,
      }
    );
  }

  removeJob(paymentId: string) {
    console.log('remove queue');
    return this.paymentQueue.remove(generateCancelPaymentJobId(paymentId));
  }
}
