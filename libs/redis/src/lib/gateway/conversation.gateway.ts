import { RedisEvent, RedisNamespace } from '@common/constants/redis.constant';
import {
  CHAT_SERVICE_NAME,
  CHAT_SERVICE_PACKAGE_NAME,
  ChatServiceClient,
} from '@common/interfaces/proto-types/chat';
import { generateRoomUser } from '@common/utils/room-id.util';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: RedisNamespace.CONVERSATION })
export class ConversationGateway implements OnGatewayConnection, OnModuleInit {
  private chatService!: ChatServiceClient;
  @WebSocketServer()
  server!: Server;

  constructor(
    @Inject(CHAT_SERVICE_PACKAGE_NAME)
    private chatServiceClient: ClientGrpc
  ) {}

  onModuleInit() {
    this.chatService =
      this.chatServiceClient.getService<ChatServiceClient>(CHAT_SERVICE_NAME);
  }

  handleConnection(client: Socket) {
    const userId = client.data['userId'];
    if (userId) {
      const room = generateRoomUser(userId);
      client.join(room);
    }
  }

  async refresh(participantIds: string[]) {
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
    const roomA = generateRoomUser(participantIds[0]);
    const roomB = generateRoomUser(participantIds[1]);
    this.server
      .to(roomA)
      .emit(RedisEvent.REFRESH_CONVERSATIONS, userA.conversations);
    this.server
      .to(roomB)
      .emit(RedisEvent.REFRESH_CONVERSATIONS, userB.conversations);
  }
}
