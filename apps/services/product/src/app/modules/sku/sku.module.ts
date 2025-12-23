import { Module } from '@nestjs/common';
import { SKUConsumerController } from './controllers/SKU-consumer.controller';
import { SKUGrpcController } from './controllers/sku-grpc.controller';
import { SKURepository } from './repositories/sku.repository';
import { SKUService } from './services/sku.service';

@Module({
  controllers: [SKUGrpcController, SKUConsumerController],
  providers: [SKURepository, SKUService],
})
export class SKUModule {}
