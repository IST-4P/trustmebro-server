import { RedisEvent, RedisNamespace } from '@common/constants/redis.constant';
import { NotificationResponse } from '@common/interfaces/models/notification';
import { generateRoomUser } from '@common/utils/room-id.util';
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
      const room = generateRoomUser(userId);
      client.join(room);
    }
  }

  create(notification: NotificationResponse) {
    const room = generateRoomUser(notification.userId);
    this.server.to(room).emit(RedisEvent.NEW_NOTIFICATION, notification);
  }
}
