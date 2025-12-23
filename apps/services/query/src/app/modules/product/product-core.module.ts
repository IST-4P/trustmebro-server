import { Module } from '@nestjs/common';
import { AttributeModule } from './attribute/attribute.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { ShipsFromModule } from './ships-from/ships-from.module';

@Module({
  imports: [
    CategoryModule,
    BrandModule,
    AttributeModule,
    ShipsFromModule,
    ProductModule,
  ],
})
export class ProductCoreModule {}
