/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppConfiguration } from '@common/configurations/app.config';
import { BaseConfiguration } from '@common/configurations/base.config';
import { GrpcServerOptions } from '@common/configurations/grpc.config';
import { KafkaServerOptions } from '@common/configurations/kafka.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { QueueGroups } from '@common/constants/queue.constant';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = BaseConfiguration.GLOBAL_PREFIX || 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = AppConfiguration.QUERY_SERVICE_PORT || 3004;

  app.connectMicroservice(GrpcServerOptions(GrpcService.QUERY_SERVICE));
  app.connectMicroservice(KafkaServerOptions(QueueGroups.QUERY_GROUP));
  await app.startAllMicroservices();

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
