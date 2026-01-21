import { QueueTopics } from '@common/constants/queue.constant';
import { CreateReplyResponse } from '@common/interfaces/models/review';
import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ReplyService } from '../services/reply.service';

@Controller()
export class ReplyConsumerController {
  constructor(private readonly replyService: ReplyService) {}

  @EventPattern(QueueTopics.REVIEW.CREATE_REPLY)
  createReply(@Payload() payload: CreateReplyResponse) {
    return this.replyService.update(payload);
  }

  @EventPattern(QueueTopics.REVIEW.UPDATE_REPLY)
  updateReply(@Payload() payload: CreateReplyResponse) {
    return this.replyService.update(payload);
  }

  @EventPattern(QueueTopics.REVIEW.DELETE_REPLY)
  deleteReply(@Payload() payload: { ReviewId: string }) {
    return this.replyService.delete(payload);
  }
}
