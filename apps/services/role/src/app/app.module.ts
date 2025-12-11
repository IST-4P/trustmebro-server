import { Module } from '@nestjs/common';
import { RoleModule } from './modules/role/role.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, RoleModule],
})
export class AppModule {}
