import { RedisChannel } from '@common/constants/redis.constant';
import {
  CreateMessageRequest,
  GetManyMessagesRequest,
  GetManyMessagesResponse,
  MessageResponse,
} from '@common/interfaces/models/chat';
import { RedisService } from '@common/redis/redis/redis.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly redisService: RedisService
  ) {}

  async list({
    processId,
    ...data
  }: GetManyMessagesRequest): Promise<GetManyMessagesResponse> {
    const messages = await this.messageRepository.list(data);
    if (messages.totalItems === 0) {
      throw new NotFoundException('Error.MessagesNotFound');
    }
    return messages;
  }

  async create({
    processId,
    ...data
  }: CreateMessageRequest): Promise<MessageResponse> {
    const createdMessage = await this.messageRepository.create(data);
    await this.redisService.publish(
      RedisChannel.UPDATE_CONVERSATION_CHANNEL,
      JSON.stringify({
        participantIds: createdMessage.participantIds,
      })
    );
    return createdMessage.message;
  }
}
