import { Module } from '@nestjs/common';
import { AttributeModule } from './attribute/attribute.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [CategoryModule, BrandModule, AttributeModule, ProductModule],
})
export class ProductCoreModule {}
