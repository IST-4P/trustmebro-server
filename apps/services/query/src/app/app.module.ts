import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationModule } from './modules/notification/notification.module';
import { ProductCoreModule } from './modules/product/product-core.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule.forRoot('query'),
    HealthModule,
    ProductCoreModule,
    NotificationModule,
    MediaModule,
  ],
})
export class AppModule {}
