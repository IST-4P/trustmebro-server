import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { LoggerModule } from '@common/observability/logger';
import { Module } from '@nestjs/common';
import { AttributeModule } from './modules/attribute/attribute.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { HealthModule } from './modules/health/health.module';
import { ProductModule } from './modules/product/product.module';
import { ShipsFromModule } from './modules/ships-from/ships-from.module';
import { SKUModule } from './modules/sku/sku.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    KafkaModule.register(QueueService.PRODUCT_SERVICE),
    LoggerModule.forRoot('product'),
    HealthModule,
    CategoryModule,
    BrandModule,
    AttributeModule,
    ProductModule,
    ShipsFromModule,
    SKUModule,
  ],
})
export class AppModule {}
