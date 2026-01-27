/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppConfiguration } from '@common/configurations/app.config';
import { BaseConfiguration } from '@common/configurations/base.config';
import { DefaultRoleNameValues } from '@common/constants/user.constant';
import { PinoLogger } from '@common/observability/logger';
import { WebSocketAdapter } from '@common/redis/websocket/websocket.adapter';
import { WebSocketService } from '@common/redis/websocket/websocket.service';
import { syncPermissions } from '@common/utils/sync-permissions.util';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {} from 'nestjs-zod';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(PinoLogger));

  const globalPrefix = BaseConfiguration.GLOBAL_PREFIX || 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: [
      'https://tusd.hacmieu.xyz',
      'https://korbin-malacological-densely.ngrok-free.dev',
      'https://uncoachable-buffable-talisha.ngrok-free.dev',
    ],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('TrustMeBro-Seller API')
    .setDescription('Quỳ xuống mà xin API đi bro')
    .setVersion('1.0.0')
    .addBearerAuth({
      description: 'Default JWT Authorization',
      type: 'http',
      in: 'header',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'Authorization',
    })
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, documentFactory);

  const port = AppConfiguration.BFF_SELLER_SERVICE_PORT || 3300;

  const webSocketService = app.get(WebSocketService);
  const websocketAdapter = new WebSocketAdapter(app, webSocketService);
  await websocketAdapter.connectToRedis();
  app.useWebSocketAdapter(websocketAdapter);

  await app.listen(port);

  // Sync permissions with database
  await syncPermissions(app, DefaultRoleNameValues.SELLER);
}

bootstrap();
