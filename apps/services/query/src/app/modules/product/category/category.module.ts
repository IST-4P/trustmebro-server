import { CacheProvider } from '@common/configurations/redis.config';
import { Module } from '@nestjs/common';
import { CategoryConsumerController } from './controllers/category-consumer.controller';
import { CategoryGrpcController } from './controllers/category-grpc.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';

@Module({
  imports: [CacheProvider],
  controllers: [CategoryConsumerController, CategoryGrpcController],
  providers: [CategoryRepository, CategoryService],
})
export class CategoryModule {}
