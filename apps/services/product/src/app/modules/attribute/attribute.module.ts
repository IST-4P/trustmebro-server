import { Global, Module } from '@nestjs/common';
import { AttributeGrpcController } from './controllers/attribute-grpc.controller';
import { CategoryAttributeGrpcController } from './controllers/category-attributes-grpc.controller';
import { AttributeRepository } from './repositories/attribute.repository';
import { CategoryAttributeRepository } from './repositories/category-attribute.repository';
import { AttributeService } from './services/attribute.service';
import { CategoryAttributeService } from './services/category-attribute.service';

@Global()
@Module({
  controllers: [AttributeGrpcController, CategoryAttributeGrpcController],
  providers: [
    AttributeRepository,
    AttributeService,
    CategoryAttributeRepository,
    CategoryAttributeService,
  ],
  exports: [AttributeService, CategoryAttributeService],
})
export class AttributeModule {}
