import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { ProductController } from './controllers/product.controller';
import { ProductReadService } from './services/product/product-read.service';
import { ProductWriteService } from './services/product/product-write.service';

@Module({
  imports: [
    ClientsModule.register([
      GrpcClientProvider(GrpcService.PRODUCT_SERVICE),
      GrpcClientProvider(GrpcService.QUERY_SERVICE),
    ]),
  ],
  controllers: [ProductController, ProductController],
  providers: [ProductWriteService, ProductReadService],
})
export class ProductModule {}
