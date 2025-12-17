import { Module } from '@nestjs/common';
import { ProductModule } from './modules/product/product.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductModule],
})
export class AppModule {}
