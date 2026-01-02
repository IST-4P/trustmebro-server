import {
  CHAT_SERVICE_NAME,
  CHAT_SERVICE_PACKAGE_NAME,
  ChatServiceClient,
  GetManyConversationsRequest,
  GetManyConversationsResponse,
} from '@common/interfaces/proto-types/chat';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ConversationReadService implements OnModuleInit {
  private chatService!: ChatServiceClient;

  constructor(
    @Inject(CHAT_SERVICE_PACKAGE_NAME)
    private chatServiceClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.chatService =
      this.chatServiceClient.getService<ChatServiceClient>(CHAT_SERVICE_NAME);
  }

  async getManyConversations(
    data: GetManyConversationsRequest
  ): Promise<GetManyConversationsResponse> {
    return firstValueFrom(this.chatService.getManyConversations(data));
  }
}
