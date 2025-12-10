/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { AppConfiguration } from '@common/configurations/app.config';
import { BaseConfiguration } from '@common/configurations/base.config';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const globalPrefix = BaseConfiguration.GLOBAL_PREFIX || 'api/v1';
  app.setGlobalPrefix(globalPrefix);

  app.enableCors({ origin: '*' });

  const config = new DocumentBuilder()
    .setTitle('TrustMeBro-Web API')
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

  const port = AppConfiguration.BFF_WEB_SERVICE_PORT || 3100;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
