import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { ImageModule } from './modules/image/image.module';
import { VideoModule } from './modules/video/video.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule.forRoot('media'),
    HealthModule,
    ImageModule,
    VideoModule,
  ],
})
export class AppModule {}
