import { RedisConfiguration } from '@common/configurations/redis.config';
import { DefaultRoleNameValues } from '@common/constants/user.constant';
import { INestApplicationContext, UnauthorizedException } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { parse } from 'cookie';
import { createClient } from 'redis';
import { Server, ServerOptions, Socket } from 'socket.io';
import { WebSocketService } from './websocket.service';

export class WebSocketAdapter extends IoAdapter {
  private adapterConstructor?: ReturnType<typeof createAdapter>;

  constructor(
    app: INestApplicationContext,
    private readonly webSocketService: WebSocketService
  ) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    try {
      const pubClient = createClient({ url: RedisConfiguration.REDIS_URL });
      const subClient = pubClient.duplicate();

      pubClient.on('error', (err) =>
        console.error('❌ Lỗi Redis PubClient:', err)
      );
      subClient.on('error', (err) =>
        console.error('❌ Lỗi Redis SubClient:', err)
      );

      await Promise.all([pubClient.connect(), subClient.connect()]);

      this.adapterConstructor = createAdapter(pubClient, subClient);
      console.log('✅ Redis adapter connected successfully');
    } catch (error) {
      console.error('❌ Failed to connect Redis adapter:', error);
    }
  }

  override createIOServer(port: number, options?: ServerOptions) {
    const server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: true,
        credentials: true,
      },
    }) as unknown as Server;

    // Apply Redis adapter nếu có
    if (this.adapterConstructor) {
      server.adapter(this.adapterConstructor);
    }

    server.of(/.*/).use((socket, next) => {
      void this.authMiddleware(
        [
          DefaultRoleNameValues.CUSTOMER,
          DefaultRoleNameValues.SELLER,
          DefaultRoleNameValues.ADMIN,
        ],
        socket,
        next
      );
    });

    return server;
  }

  private async authMiddleware(
    roleName: string[],
    socket: Socket,
    next: (err?: Error) => void
  ) {
    const { authorization, cookie: cookieHeader } = socket.handshake.headers;

    let accessToken: string | undefined;
    if (authorization?.startsWith('Bearer ')) {
      accessToken = authorization.split(' ')[1];
    } else if (typeof cookieHeader === 'string') {
      const cookies = parse(cookieHeader);
      accessToken = cookies['accessToken'];
    }

    if (!accessToken) {
      return next(new UnauthorizedException('Missing authentication token'));
    }

    try {
      const payload = await this.webSocketService.verifyToken(accessToken);

      if (!roleName.includes(payload.roleName)) {
        return next(new Error('Access denied'));
      }

      socket.data['userId'] = payload.userId;
      socket.data['roleName'] = payload.roleName;

      console.log(
        `✅ WebSocket authenticated: userId=${payload.userId}, role=${payload.roleName}`
      );
      next();
    } catch (error) {
      console.error('❌ WebSocket authentication failed:', error);
      next(new Error('Invalid or expired token'));
    }
  }
}
