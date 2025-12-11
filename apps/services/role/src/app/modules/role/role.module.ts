import { Module } from '@nestjs/common';
import { RoleGrpcController } from './controllers/role.controller';
import { RoleRepository } from './repositories/role.repository';
import { RoleService } from './services/role.service';

@Module({
  controllers: [RoleGrpcController],
  providers: [RoleRepository, RoleService],
})
export class RoleModule {}
