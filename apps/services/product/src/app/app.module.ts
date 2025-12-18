import { QueueService } from '@common/constants/queue.constant';
import { KafkaModule } from '@common/kafka/kafka.module';
import { Module } from '@nestjs/common';
import { AttributeModule } from './modules/attribute/attribute.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { ShipsFromModule } from './modules/ships-from/ships-from.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    KafkaModule.register(QueueService.PRODUCT_SERVICE),
    BrandModule,
    CategoryModule,
    AttributeModule,
    ProductModule,
    ShipsFromModule,
  ],
})
export class AppModule {}
