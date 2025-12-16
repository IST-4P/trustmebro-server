import {
  GrpcClientProvider,
  GrpcService,
} from '@common/configurations/grpc.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { BrandController } from './controllers/brand.controller';
import { CategoryController } from './controllers/category.controller';
import { BrandService } from './services/brand.service';
import { CategoryService } from './services/category.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.PRODUCT_SERVICE)]),
  ],
  controllers: [CategoryController, BrandController],
  providers: [CategoryService, BrandService],
})
export class ProductModule {}
