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

  async refreshConversation(participantIds: string[]) {
    if (!participantIds[0] || !participantIds[1]) {
      throw new Error('Invalid participantIds');
    }

    const userA$ = firstValueFrom(
      this.chatService.getManyConversations({
        limit: 10,
        page: 1,
        userId: participantIds[0],
      })
    );
    const userB$ = firstValueFrom(
      this.chatService.getManyConversations({
        limit: 10,
        page: 1,
        userId: participantIds[1],
      })
    );
    const [userA, userB] = await Promise.all([userA$, userB$]);
    return {
      [participantIds[0]]: userA,
      [participantIds[1]]: userB,
    };
  }
}
