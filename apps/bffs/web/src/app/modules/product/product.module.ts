import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { BrandController } from './controllers/brand.controller';
import { CategoryController } from './controllers/category.controller';
import { ProductController } from './controllers/product.controller';
import { BrandReadService } from './services/brand-read.service';
import { CategoryReadService } from './services/category-read.service';
import { ProductReadService } from './services/product-read.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.PRODUCT_SERVICE),
      GrpcClientProvider(GrpcService.QUERY_SERVICE),
    ]),
  ],
  controllers: [CategoryController, BrandController, ProductController],
  providers: [CategoryReadService, BrandReadService, ProductReadService],
})
export class ProductModule {}
