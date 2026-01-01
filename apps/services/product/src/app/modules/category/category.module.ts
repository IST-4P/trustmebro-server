import { CacheProvider } from '@common/configurations/redis.config';
import { Global, Module } from '@nestjs/common';
import { CategoryGrpcController } from './controllers/category-grpc.controller';
import { CategoryRepository } from './repositories/category.repository';
import { CategoryService } from './services/category.service';

@Global()
@Module({
  imports: [CacheProvider],
  controllers: [CategoryGrpcController],
  providers: [CategoryRepository, CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
