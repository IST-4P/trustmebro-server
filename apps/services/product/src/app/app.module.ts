import { Module } from '@nestjs/common';
import { AttributeModule } from './modules/attribute/attribute.module';
import { BrandModule } from './modules/brand/brand.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BrandModule,
    CategoryModule,
    AttributeModule,
    ProductModule,
  ],
})
export class AppModule {}
