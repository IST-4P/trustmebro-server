import { Module } from '@nestjs/common';
import { ProductConsumerController } from './controllers/product-consumer.controller';
import { ProductGrpcController } from './controllers/product-grpc.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';

@Module({
  controllers: [ProductGrpcController, ProductConsumerController],
  providers: [ProductRepository, ProductService],
})
export class ProductModule {}
