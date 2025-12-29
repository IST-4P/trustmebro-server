import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { NotificationModule } from './modules/notification/notification.module';
import { ProductCoreModule } from './modules/product/product-core.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    LoggerModule.forRoot('query'),
    ProductCoreModule,
    NotificationModule,
  ],
})
export class AppModule {}
