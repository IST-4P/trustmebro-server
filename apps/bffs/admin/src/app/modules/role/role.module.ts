import { GrpcClientProvider } from '@common/configurations/grpc.config';
import { GrpcService } from '@common/constants/grpc.constant';
import { Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';

@Module({
  imports: [
    ClientsModule.register([GrpcClientProvider(GrpcService.ROLE_SERVICE)]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
