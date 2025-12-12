import { Module } from '@nestjs/common';
import { PermissionModule } from './modules/permission/permission.module';
import { RoleModule } from './modules/role/role.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, RoleModule, PermissionModule],
})
export class AppModule {}
