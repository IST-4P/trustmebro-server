import { RedisNamespace } from '@common/constants/redis.constant';
import { CreateMessageRequest } from '@common/interfaces/models/chat';
import {
  CHAT_SERVICE_NAME,
  CHAT_SERVICE_PACKAGE_NAME,
  ChatServiceClient,
} from '@common/interfaces/proto-types/chat';
import { generateRoomConversation } from '@common/utils/room-id.util';
import { Inject, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { firstValueFrom } from 'rxjs';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: RedisNamespace.MESSAGE })
export class MessageGateway implements OnGatewayConnection, OnModuleInit {
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
    const conversationId = client.handshake.query['conversationId'];
    if (conversationId) {
      const room = generateRoomConversation(conversationId as string);
      client.join(room);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleEvent(
    @MessageBody() message: CreateMessageRequest,
    @ConnectedSocket() client: Socket
  ) {
    const senderId = client.data['userId'];
    const newMessage = await firstValueFrom(
      this.chatService.createMessage({
        ...message,
        senderId,
      })
    );
    const recipientRoom = generateRoomConversation(newMessage.conversationId);
    this.server.to(recipientRoom).emit('newMessage', newMessage);
  }
}
