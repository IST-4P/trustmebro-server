import { Module } from '@nestjs/common';
import { ShipsFromConsumerController } from './controllers/ships-from-consumer.controller';
import { ShipsFromGrpcController } from './controllers/ships-from-grpc.controller';
import { ShipsFromRepository } from './repositories/ships-from.repository';
import { ShipsFromService } from './services/ships-from.service';

@Module({
  controllers: [ShipsFromConsumerController, ShipsFromGrpcController],
  providers: [ShipsFromRepository, ShipsFromService],
})
export class ShipsFromModule {}
