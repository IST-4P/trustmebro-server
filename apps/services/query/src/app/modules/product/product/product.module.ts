import { Module } from '@nestjs/common';
import { ProductConsumerController } from './controllers/product-consumer.controller';
import { ProductRepository } from './repositories/product.repository';
import { ProductService } from './services/product.service';

@Module({
  controllers: [ProductConsumerController],
  providers: [ProductRepository, ProductService],
})
export class ProductModule {}
