import { Module } from '@nestjs/common';
import { AttributeConsumerController } from './controllers/attribute-consumer.controller';
import { AttributeGrpcController } from './controllers/attribute-grpc.controller';
import { AttributeRepository } from './repositories/attribute.repository';
import { AttributeService } from './services/attribute.service';

@Module({
  controllers: [AttributeConsumerController, AttributeGrpcController],
  providers: [AttributeRepository, AttributeService],
})
export class AttributeModule {}
