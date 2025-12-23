import {
  ConversationResponse,
  CreateConversationRequest,
  GetManyConversationsRequest,
  GetManyConversationsResponse,
  UpdateConversationRequest,
} from '@common/interfaces/models/chat';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ConversationRepository } from '../repositories/conversation.repository';

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository
  ) {}

  async list({
    processId,
    ...data
  }: GetManyConversationsRequest): Promise<GetManyConversationsResponse> {
    const conversations = await this.conversationRepository.list(data);
    if (conversations.totalItems === 0) {
      throw new NotFoundException('Error.ConversationsNotFound');
    }
    return conversations;
  }

  async create({
    processId,
    ...data
  }: CreateConversationRequest): Promise<ConversationResponse> {
    return this.conversationRepository.create({
      participantIds: data.participantIds.sort(),
    });
  }

  async update({
    processId,
    ...data
  }: UpdateConversationRequest): Promise<ConversationResponse> {
    try {
      const updatedConversation = await this.conversationRepository.update(
        data
      );

      return updatedConversation;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Error.ConversationNotFound');
      }
      throw error;
    }
  }
}
