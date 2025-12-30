import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { ImageModule } from './modules/image/image.module';

@Module({
  imports: [LoggerModule.forRoot('media'), HealthModule, ImageModule],
})
export class AppModule {}
