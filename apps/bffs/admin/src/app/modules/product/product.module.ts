import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { AttributeController } from './controllers/attribute.controller';
import { BrandController } from './controllers/brand.controller';
import { CategoryController } from './controllers/category.controller';
import { AttributeReadService } from './services/attribute-read.service';
import { AttributeWriteService } from './services/attribute-write.service';
import { BrandReadService } from './services/brand-read.service';
import { BrandWriteService } from './services/brand-write.service';
import { CategoryReadService } from './services/category-read.service';
import { CategoryWriteService } from './services/category-write.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.PRODUCT_SERVICE),
      GrpcClientProvider(GrpcService.QUERY_SERVICE),
    ]),
  ],
  controllers: [CategoryController, BrandController, AttributeController],
  providers: [
    CategoryReadService,
    CategoryWriteService,
    BrandWriteService,
    BrandReadService,
    AttributeReadService,
    AttributeWriteService,
  ],
})
export class ProductModule {}
