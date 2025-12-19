import { RedisNamespace } from '@common/constants/redis.constant';
import { NotificationResponse } from '@common/interfaces/models/notification';
import { generateRoomUserId } from '@common/utils/room-id.util';
import {
  OnGatewayConnection,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ namespace: RedisNamespace.NOTIFICATION })
export class NotificationGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const userId = client.data['userId'];
    if (userId) {
      const room = generateRoomUserId(userId);
      client.join(room);
    }
  }

  create(notification: NotificationResponse) {
    const room = generateRoomUserId(notification.userId);
    this.server.to(room).emit('newNotification', notification);
  }
}
