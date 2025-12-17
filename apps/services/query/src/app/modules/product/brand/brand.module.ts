import { Module } from '@nestjs/common';
import { BrandConsumerController } from './controllers/brand-consumer.controller';
import { BrandGrpcController } from './controllers/brand-grpc.controller';
import { BrandRepository } from './repositories/brand.repository';
import { BrandService } from './services/brand.service';

@Module({
  controllers: [BrandConsumerController, BrandGrpcController],
  providers: [BrandRepository, BrandService],
})
export class BrandModule {}
