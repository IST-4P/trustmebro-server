import {
  GrpcClientProvider,
  GrpcService,
} from '@common/configurations/grpc.config';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.ROLE_SERVICE)]),
  ],
  controllers: [],
  providers: [],
})
export class RoleModule {}
