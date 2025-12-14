import {
  GrpcClientProvider,
  GrpcService,
} from '@common/configurations/grpc.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { CategoryController } from './controllers/category.controller';
import { CategoryService } from './services/category.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.PRODUCT_SERVICE)]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class ProductModule {}
