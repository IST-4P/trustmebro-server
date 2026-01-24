/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppConfiguration } from '@common/configurations/app.config';
import { BaseConfiguration } from '@common/configurations/base.config';
import { DefaultRoleNameValues } from '@common/constants/user.constant';
import { PinoLogger } from '@common/observability/logger';
import { syncPermissions } from '@common/utils/sync-permissions.util';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.useLogger(app.get(PinoLogger));

  const globalPrefix = BaseConfiguration.GLOBAL_PREFIX || 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({
    origin: ['https://localhost:3000', 'https://tusd.hacmieu.xyz'],
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('TrustMeBro-Admin API')
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

  const port = AppConfiguration.BFF_ADMIN_SERVICE_PORT || 3200;
  await app.listen(port);

  // Sync permissions with database
  await syncPermissions(app, DefaultRoleNameValues.ADMIN);
}

bootstrap();
