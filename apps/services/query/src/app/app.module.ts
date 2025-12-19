import { Module } from '@nestjs/common';
import { NotificationModule } from './modules/notification/notification.module';
import { ProductCoreModule } from './modules/product/product-core.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductCoreModule, NotificationModule],
})
export class AppModule {}
