import {
  CHAT_SERVICE_NAME,
  CHAT_SERVICE_PACKAGE_NAME,
  ChatServiceClient,
  ConversationResponse,
  CreateConversationRequest,
} from '@common/interfaces/proto-types/chat';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConversationWriteService implements OnModuleInit {
  private chatService!: ChatServiceClient;

  constructor(
    @Inject(CHAT_SERVICE_PACKAGE_NAME)
    private chatServiceClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.chatService =
      this.chatServiceClient.getService<ChatServiceClient>(CHAT_SERVICE_NAME);
  }

  async createConversation(
    data: CreateConversationRequest
  ): Promise<ConversationResponse> {
    return firstValueFrom(this.chatService.createConversation(data));
  }
}
