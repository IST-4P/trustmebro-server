import { Module } from '@nestjs/common';
import { PermissionGrpcController } from './controllers/permission-grpc.controller';
import { PermissionRepository } from './repositories/permission.repository';
import { PermissionService } from './services/permission.service';

@Module({
  controllers: [PermissionGrpcController],
  providers: [PermissionRepository, PermissionService],
})
export class PermissionModule {}
