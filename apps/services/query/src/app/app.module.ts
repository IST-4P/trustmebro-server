import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { HealthModule } from './modules/health/health.module';
import { MediaModule } from './modules/media/media.module';
import { NotificationModule } from './modules/notification/notification.module';
import { OrderModule } from './modules/order/order.module';
import { ProductCoreModule } from './modules/product/product-core.module';
import { ReviewModule } from './modules/review/review.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule.forRoot('query'),
    HealthModule,
    ProductCoreModule,
    NotificationModule,
    MediaModule,
    OrderModule,
    ReviewModule,
  ],
})
export class AppModule {}
