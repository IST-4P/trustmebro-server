import { CreateReplyResponse } from '@common/interfaces/models/review';
import { Injectable } from '@nestjs/common';
import { UpdateReplyMapper } from '../mappers/reply.mapper';
import { ReplyRepository } from '../repositories/reply.repository';

@Injectable()
export class ReplyService {
  constructor(private readonly replyRepository: ReplyRepository) {}

  update(data: CreateReplyResponse) {
    return this.replyRepository.update(UpdateReplyMapper(data));
  }

  delete(data: { ReviewId: string }) {
    return this.replyRepository.delete({ id: data.ReviewId });
  }
}
