/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppConfiguration } from '@common/configurations/app.config';
import { BaseConfiguration } from '@common/configurations/base.config';
import { GrpcConfiguration } from '@common/configurations/grpc.config';
import { AUTH_SERVICE_PACKAGE_NAME } from '@common/interfaces/proto-types/auth';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { GrpcOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = BaseConfiguration.GLOBAL_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = AppConfiguration.AUTH_SERVICE_PORT || 3000;

  app.connectMicroservice<GrpcOptions>({
    transport: Transport.GRPC,
    options: {
      url: GrpcConfiguration.AUTH_SERVICE_GRPC_URL,
      package: AUTH_SERVICE_PACKAGE_NAME,
      protoPath: join(__dirname, GrpcConfiguration.AUTH_SERVICE_PROTO_PATH),
    },
  });
  await app.startAllMicroservices();

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
