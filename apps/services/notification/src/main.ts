/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppConfiguration } from '@common/configurations/app.config';
import { BaseConfiguration } from '@common/configurations/base.config';
import { GrpcServerOptions } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { WebSocketAdapter } from '@common/websocket/websocket.adapter';
import { WebSocketService } from '@common/websocket/websocket.service';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = BaseConfiguration.GLOBAL_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = AppConfiguration.NOTIFICATION_SERVICE_PORT || 3005;

  app.connectMicroservice(GrpcServerOptions(GrpcService.NOTIFICATION_SERVICE));
  await app.startAllMicroservices();

  const webSocketService = app.get(WebSocketService);
  const websocketAdapter = new WebSocketAdapter(app, webSocketService);
  await websocketAdapter.connectToRedis();
  app.useWebSocketAdapter(websocketAdapter);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
