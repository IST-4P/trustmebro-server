import { CacheProvider } from '@common/configurations/redis.config';
import { Global, Module } from '@nestjs/common';
import { ShipsFromGrpcController } from './controllers/ships-from-grpc.controller';
import { ShipsFromRepository } from './repositories/ships-from.repository';
import { ShipsFromService } from './services/ships-from.service';

@Global()
@Module({
  imports: [CacheProvider],
  controllers: [ShipsFromGrpcController],
  providers: [ShipsFromRepository, ShipsFromService],
  exports: [ShipsFromService],
})
export class ShipsFromModule {}
