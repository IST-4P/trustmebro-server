import { Module } from '@nestjs/common';
import { ProductCoreModule } from './modules/product/product-core.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductCoreModule],
})
export class AppModule {}
